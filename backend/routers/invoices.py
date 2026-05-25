import math
from datetime import date, datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, text

from backend.database import get_db
from backend.dependencies import get_current_user
from backend.models.hoadon import HoaDon
from backend.models.chitiethoadon import ChiTietHoaDon
from backend.models.sanpham import SanPham
from backend.models.nhanvien import NhanVien
from backend.models.khachhang import KhachHang
from backend.models.phuongthuctt import PhuongThucTT
from backend.models.khuyenmai import KhuyenMai
from backend.models.ap_dung_km import ApDungKM
from backend.models.lichsudiem import LichSuDiem
from backend.schemas.invoice import (
    InvoiceCreate,
    InvoiceResponse,
    InvoiceFullResponse,
    InvoiceDetailResponse,
    CheckoutResponse,
)

router = APIRouter(prefix="/api/invoices", tags=["Invoices"])

# Tier thresholds (cumulative points)
TIER_THRESHOLDS = [
    (10000, "Kim Cương"),
    (5000, "Vàng"),
    (2000, "Bạc"),
    (0, "Đồng"),
]

# 10 points = 1 VND discount
POINT_VALUE = 0.1


def _determine_tier(total_points: int) -> str:
    for threshold, tier in TIER_THRESHOLDS:
        if total_points >= threshold:
            return tier
    return "Đồng"


@router.get("", response_model=list[InvoiceResponse])
def get_invoices(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return db.query(HoaDon).order_by(HoaDon.NgayLap.desc(), HoaDon.MaHD.desc()).all()


@router.get("/{MaHD}", response_model=InvoiceFullResponse)
def get_invoice(MaHD: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    invoice = db.query(HoaDon).filter(HoaDon.MaHD == MaHD).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    employee = db.query(NhanVien).filter(NhanVien.MaNV == invoice.MaNV).first()
    customer = db.query(KhachHang).filter(KhachHang.MaKH == invoice.MaKH).first()
    payment = db.query(PhuongThucTT).filter(PhuongThucTT.MaPT == invoice.MaPT).first()

    details = db.query(ChiTietHoaDon).filter(ChiTietHoaDon.MaHD == MaHD).all()
    items = []
    for d in details:
        product = db.query(SanPham).filter(SanPham.MaSP == d.MaSP).first()
        items.append(
            InvoiceDetailResponse(
                MaHD=d.MaHD,
                MaSP=d.MaSP,
                SoLuong=d.SoLuong,
                DonGia=d.DonGia,
                TenSP=product.TenSP if product else None,
                HinhAnh=product.HinhAnh if product else None,
            )
        )

    return InvoiceFullResponse(
        MaHD=invoice.MaHD,
        NgayLap=invoice.NgayLap,
        TongTien=invoice.TongTien,
        MaNV=invoice.MaNV,
        MaKH=invoice.MaKH,
        MaPT=invoice.MaPT,
        employee_name=employee.HoTen if employee else None,
        customer_name=customer.HoTen if customer else None,
        payment_name=payment.TenPT if payment else None,
        items=items,
    )


def _get_active_discount(db: Session, MaSP: str, today: date) -> float:
    result = (
        db.query(ApDungKM.MucGiam)
        .join(KhuyenMai, ApDungKM.MaKM == KhuyenMai.MaKM)
        .filter(
            ApDungKM.MaSP == MaSP,
            KhuyenMai.NgayBatDau <= today,
            KhuyenMai.NgayKetThuc >= today,
        )
        .first()
    )
    return result[0] if result else 0.0


@router.post("", response_model=CheckoutResponse, status_code=201)
def create_invoice(invoice: InvoiceCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # Validate employee
    employee = db.query(NhanVien).filter(NhanVien.MaNV == invoice.MaNV).first()
    if not employee:
        raise HTTPException(status_code=400, detail="Employee not found")

    # Validate customer
    customer = db.query(KhachHang).filter(KhachHang.MaKH == invoice.MaKH).first()
    if not customer:
        raise HTTPException(status_code=400, detail="Customer not found")

    # Validate payment method
    payment = db.query(PhuongThucTT).filter(PhuongThucTT.MaPT == invoice.MaPT).first()
    if not payment:
        raise HTTPException(status_code=400, detail="Payment method not found")

    if not invoice.items:
        raise HTTPException(status_code=400, detail="Invoice must have at least one item")

    # Validate points_used
    points_used = invoice.points_used
    if points_used < 0:
        raise HTTPException(status_code=400, detail="Points used cannot be negative")
    if points_used > (customer.DiemTichLuy or 0):
        raise HTTPException(
            status_code=400,
            detail=f"Not enough points. Available: {customer.DiemTichLuy or 0}",
        )

    now = datetime.now()
    today = now.date()
    subtotal = 0.0
    total_discount = 0.0
    product_data = []

    for item in invoice.items:
        product = db.query(SanPham).filter(SanPham.MaSP == item.MaSP).first()
        if not product:
            raise HTTPException(status_code=400, detail=f"Product {item.MaSP} not found")
        if product.SoLuongTon < item.SoLuong:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {product.TenSP} (available: {product.SoLuongTon})",
            )
        line_total = product.GiaBan * item.SoLuong
        discount = _get_active_discount(db, item.MaSP, today) * item.SoLuong
        subtotal += line_total
        total_discount += discount
        product_data.append((product, item.SoLuong, product.GiaBan, discount))

    # Points discount: 1 point = 10 VND
    points_discount = points_used * POINT_VALUE

    after_discount = subtotal - total_discount - points_discount
    if after_discount < 0:
        after_discount = 0
    tax = round(after_discount * 0.10, 2)
    total = round(after_discount + tax, 2)

    # Generate invoice ID
    max_id = db.query(func.max(HoaDon.MaHD)).scalar()
    if max_id:
        num = int(max_id.replace("HD", "")) + 1
    else:
        num = 1
    new_id = f"HD{num:02d}"

    # Create invoice
    db_invoice = HoaDon(
        MaHD=new_id,
        NgayLap=now,
        TongTien=total,
        MaNV=invoice.MaNV,
        MaKH=invoice.MaKH,
        MaPT=invoice.MaPT,
    )
    db.add(db_invoice)
    db.flush()

    # Create detail records + deduct stock
    for product, qty, price, discount in product_data:
        detail = ChiTietHoaDon(
            MaHD=new_id,
            MaSP=product.MaSP,
            SoLuong=qty,
            DonGia=price,
        )
        db.add(detail)
        product.SoLuongTon -= qty

    # Deduct points used
    if points_used > 0:
        db.execute(
            text("INSERT INTO LICHSUDIEM (MaKH, NgayGD, SoDiemThayDoi) VALUES (:mk, :ng, :sd)"),
            {"mk": invoice.MaKH, "ng": today, "sd": -points_used},
        )
        customer.DiemTichLuy = (customer.DiemTichLuy or 0) - points_used

    # Earn points: 1% of after_discount
    points_earned = math.floor(after_discount * 0.01)
    if points_earned > 0:
        db.execute(
            text("INSERT INTO LICHSUDIEM (MaKH, NgayGD, SoDiemThayDoi) VALUES (:mk, :ng, :sd)"),
            {"mk": invoice.MaKH, "ng": today, "sd": points_earned},
        )
        customer.DiemTichLuy = (customer.DiemTichLuy or 0) + points_earned

    # Auto-upgrade tier
    new_tier = _determine_tier(customer.DiemTichLuy or 0)
    customer.HangThanhVien = new_tier

    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Checkout failed: {str(e)}")

    return CheckoutResponse(
        MaHD=new_id,
        subtotal=round(subtotal, 2),
        discount=round(total_discount, 2),
        points_discount=round(points_discount, 2),
        tax=tax,
        total=total,
        points_earned=points_earned,
        points_used=points_used,
        new_tier=new_tier,
    )

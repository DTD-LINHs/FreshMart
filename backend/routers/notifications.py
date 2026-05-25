from datetime import date, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.database import get_db
from backend.dependencies import get_current_user
from backend.models.sanpham import SanPham
from backend.models.khuyenmai import KhuyenMai
from backend.models.hoadon import HoaDon
from backend.models.khachhang import KhachHang
from backend.schemas.notification import NotificationResponse

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])


@router.get("", response_model=list[NotificationResponse])
def get_notifications(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    notifications = []
    today = date.today()

    # Low stock products (< 10)
    low_stock = db.query(SanPham).filter(SanPham.SoLuongTon < 10).all()
    for p in low_stock:
        notifications.append(
            NotificationResponse(
                type="low_stock",
                title="Low Stock Alert",
                message=f"{p.TenSP} ({p.MaSP}) only has {p.SoLuongTon} units left",
                severity="warning",
            )
        )

    # Expiring soon (within 30 days)
    expiry_threshold = today + timedelta(days=30)
    expiring = (
        db.query(SanPham)
        .filter(SanPham.HSD != None, SanPham.HSD <= expiry_threshold, SanPham.HSD >= today)
        .all()
    )
    for p in expiring:
        days_left = (p.HSD - today).days
        notifications.append(
            NotificationResponse(
                type="expiry",
                title="Expiry Warning",
                message=f"{p.TenSP} ({p.MaSP}) expires in {days_left} days",
                severity="warning" if days_left > 7 else "error",
            )
        )

    # Already expired
    expired = (
        db.query(SanPham)
        .filter(SanPham.HSD != None, SanPham.HSD < today)
        .all()
    )
    for p in expired:
        notifications.append(
            NotificationResponse(
                type="expired",
                title="Expired Product",
                message=f"{p.TenSP} ({p.MaSP}) has expired on {p.HSD}",
                severity="error",
            )
        )

    # Active promotions
    active_promos = (
        db.query(KhuyenMai)
        .filter(KhuyenMai.NgayBatDau <= today, KhuyenMai.NgayKetThuc >= today)
        .all()
    )
    for km in active_promos:
        days_remaining = (km.NgayKetThuc - today).days
        notifications.append(
            NotificationResponse(
                type="promotion",
                title="Active Promotion",
                message=f"{km.TenKM} ends in {days_remaining} days",
                severity="info",
            )
        )

    # Recent invoices today
    today_count = db.query(func.count(HoaDon.MaHD)).filter(HoaDon.NgayLap == today).scalar()
    today_revenue = (
        db.query(func.sum(HoaDon.TongTien)).filter(HoaDon.NgayLap == today).scalar() or 0
    )
    if today_count:
        notifications.append(
            NotificationResponse(
                type="sales",
                title="Today's Sales",
                message=f"{today_count} invoices today, total revenue: ${today_revenue:.2f}",
                severity="info",
            )
        )

    # VIP customers (Kim cuong)
    vip_count = (
        db.query(func.count(KhachHang.MaKH))
        .filter(KhachHang.HangThanhVien == "Kim cuong")
        .scalar()
    )
    if vip_count:
        notifications.append(
            NotificationResponse(
                type="vip",
                title="VIP Customers",
                message=f"{vip_count} Diamond-tier customer(s)",
                severity="info",
            )
        )

    return notifications

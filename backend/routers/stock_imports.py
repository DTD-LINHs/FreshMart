from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.database import get_db
from backend.dependencies import require_role
from backend.models.phieunhap import PhieuNhap
from backend.models.chitietphieunhap import ChiTietPhieuNhap
from backend.models.sanpham import SanPham
from backend.models.nhacungcap import NhaCungCap
from backend.models.nhanvien import NhanVien

router = APIRouter(prefix="/api/stock-imports", tags=["Stock Imports"])


class StockImportItem(BaseModel):
    MaSP: str
    SoLuongNhap: int
    DonGiaNhap: float
    GhiChu: str = ""


class StockImportCreate(BaseModel):
    MaNCC: str
    MaNV: str
    items: list[StockImportItem]


@router.post("", status_code=201)
def create_stock_import(data: StockImportCreate, db: Session = Depends(get_db), current_user: dict = Depends(require_role("Quản lý", "Kho"))):
    if not db.query(NhaCungCap).filter(NhaCungCap.MaNCC == data.MaNCC).first():
        raise HTTPException(status_code=400, detail="Supplier not found")
    if not db.query(NhanVien).filter(NhanVien.MaNV == data.MaNV).first():
        raise HTTPException(status_code=400, detail="Employee not found")
    if not data.items:
        raise HTTPException(status_code=400, detail="Must have at least one item")

    total = sum(item.SoLuongNhap * item.DonGiaNhap for item in data.items)

    max_id = db.query(func.max(PhieuNhap.MaPN)).scalar()
    num = int(max_id.replace("PN", "")) + 1 if max_id else 1
    new_id = f"PN{num:02d}"

    phieu = PhieuNhap(
        MaPN=new_id,
        NgayNhap=date.today(),
        TongGiaTri=total,
        MaNCC=data.MaNCC,
        MaNV=data.MaNV,
    )
    db.add(phieu)

    for item in data.items:
        product = db.query(SanPham).filter(SanPham.MaSP == item.MaSP).first()
        if not product:
            raise HTTPException(status_code=400, detail=f"Product {item.MaSP} not found")
        detail = ChiTietPhieuNhap(
            MaPN=new_id,
            MaSP=item.MaSP,
            SoLuongNhap=item.SoLuongNhap,
            DonGiaNhap=item.DonGiaNhap,
            GhiChu=item.GhiChu,
        )
        db.add(detail)
        product.SoLuongTon = (product.SoLuongTon or 0) + item.SoLuongNhap

    try:
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Stock import failed")

    return {"MaPN": new_id, "TongGiaTri": total}

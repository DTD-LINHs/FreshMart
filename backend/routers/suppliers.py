from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.nhacungcap import NhaCungCap

router = APIRouter(prefix="/api/suppliers", tags=["Suppliers"])


@router.get("")
def get_suppliers(db: Session = Depends(get_db)):
    suppliers = db.query(NhaCungCap).all()
    return [
        {
            "MaNCC": s.MaNCC,
            "TenNCC": s.TenNCC,
            "DiaChi": s.DiaChi,
            "SDT": s.SDT,
            "Email": s.Email,
        }
        for s in suppliers
    ]

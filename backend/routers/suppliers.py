from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.dependencies import get_current_user
from backend.models.nhacungcap import NhaCungCap

router = APIRouter(prefix="/api/suppliers", tags=["Suppliers"])


@router.get("")
def get_suppliers(db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
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

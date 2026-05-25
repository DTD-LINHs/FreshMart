from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.dependencies import get_current_user
from backend.models.nhomhang import NhomHang

router = APIRouter(prefix="/api/categories", tags=["Categories"])


@router.get("")
def get_categories(db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    categories = db.query(NhomHang).all()
    return [
        {"MaNhom": c.MaNhom, "TenNhom": c.TenNhom, "GhiChu": c.GhiChu}
        for c in categories
    ]

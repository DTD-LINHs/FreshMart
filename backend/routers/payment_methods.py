from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.phuongthuctt import PhuongThucTT

router = APIRouter(prefix="/api/payment-methods", tags=["Payment Methods"])


@router.get("")
def get_payment_methods(db: Session = Depends(get_db)):
    methods = db.query(PhuongThucTT).all()
    return [
        {"MaPT": m.MaPT, "TenPT": m.TenPT, "MoTa": m.MoTa}
        for m in methods
    ]

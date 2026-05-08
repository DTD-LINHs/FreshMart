from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.khuyenmai import KhuyenMai
from backend.models.ap_dung_km import ApDungKM
from backend.models.sanpham import SanPham
from backend.schemas.promotion import PromotionResponse, PromotionDetailResponse

router = APIRouter(prefix="/api/promotions", tags=["Promotions"])


@router.get("/active", response_model=list[PromotionDetailResponse])
def get_active_promotions(db: Session = Depends(get_db)):
    today = date.today()
    promos = (
        db.query(KhuyenMai)
        .filter(KhuyenMai.NgayBatDau <= today, KhuyenMai.NgayKetThuc >= today)
        .all()
    )
    result = []
    for promo in promos:
        applied = (
            db.query(ApDungKM, SanPham)
            .join(SanPham, ApDungKM.MaSP == SanPham.MaSP)
            .filter(ApDungKM.MaKM == promo.MaKM)
            .all()
        )
        products = [
            {"MaSP": sp.MaSP, "TenSP": sp.TenSP, "MucGiam": ap.MucGiam}
            for ap, sp in applied
        ]
        result.append(
            PromotionDetailResponse(
                MaKM=promo.MaKM,
                TenKM=promo.TenKM,
                NgayBatDau=promo.NgayBatDau,
                NgayKetThuc=promo.NgayKetThuc,
                products=products,
            )
        )
    return result

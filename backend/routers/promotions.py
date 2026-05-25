from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.database import get_db
from backend.dependencies import get_current_user, require_role
from backend.models.khuyenmai import KhuyenMai
from backend.models.ap_dung_km import ApDungKM
from backend.models.sanpham import SanPham
from backend.schemas.promotion import (
    PromotionDetailResponse,
    PromotionCreate,
    PromotionUpdate,
    ProductPromotionAdd,
)

router = APIRouter(prefix="/api/promotions", tags=["Promotions"])


def _build_detail(promo, db: Session) -> PromotionDetailResponse:
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
    return PromotionDetailResponse(
        MaKM=promo.MaKM,
        TenKM=promo.TenKM,
        NgayBatDau=promo.NgayBatDau,
        NgayKetThuc=promo.NgayKetThuc,
        products=products,
    )


@router.get("/active", response_model=list[PromotionDetailResponse])
def get_active_promotions(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    today = date.today()
    promos = (
        db.query(KhuyenMai)
        .filter(KhuyenMai.NgayBatDau <= today, KhuyenMai.NgayKetThuc >= today)
        .all()
    )
    return [_build_detail(p, db) for p in promos]


@router.get("", response_model=list[PromotionDetailResponse])
def get_all_promotions(db: Session = Depends(get_db), current_user: dict = Depends(require_role("Quản lý"))):
    promos = db.query(KhuyenMai).order_by(KhuyenMai.NgayKetThuc.desc()).all()
    return [_build_detail(p, db) for p in promos]


@router.post("", response_model=PromotionDetailResponse, status_code=201)
def create_promotion(data: PromotionCreate, db: Session = Depends(get_db), current_user: dict = Depends(require_role("Quản lý"))):
    if data.NgayKetThuc < data.NgayBatDau:
        raise HTTPException(status_code=400, detail="End date must be on or after start date")

    max_id = db.query(func.max(KhuyenMai.MaKM)).scalar()
    num = int(max_id.replace("KM", "")) + 1 if max_id else 1
    new_id = f"KM{num:02d}"

    promo = KhuyenMai(
        MaKM=new_id,
        TenKM=data.TenKM,
        NgayBatDau=data.NgayBatDau,
        NgayKetThuc=data.NgayKetThuc,
    )
    db.add(promo)
    db.commit()
    db.refresh(promo)
    return _build_detail(promo, db)


@router.put("/{MaKM}", response_model=PromotionDetailResponse)
def update_promotion(MaKM: str, data: PromotionUpdate, db: Session = Depends(get_db), current_user: dict = Depends(require_role("Quản lý"))):
    promo = db.query(KhuyenMai).filter(KhuyenMai.MaKM == MaKM).first()
    if not promo:
        raise HTTPException(status_code=404, detail="Promotion not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(promo, key, value)

    start = promo.NgayBatDau
    end = promo.NgayKetThuc
    if end < start:
        raise HTTPException(status_code=400, detail="End date must be on or after start date")

    db.commit()
    db.refresh(promo)
    return _build_detail(promo, db)


@router.delete("/{MaKM}")
def delete_promotion(MaKM: str, db: Session = Depends(get_db), current_user: dict = Depends(require_role("Quản lý"))):
    promo = db.query(KhuyenMai).filter(KhuyenMai.MaKM == MaKM).first()
    if not promo:
        raise HTTPException(status_code=404, detail="Promotion not found")

    db.query(ApDungKM).filter(ApDungKM.MaKM == MaKM).delete()
    db.delete(promo)
    db.commit()
    return {"message": f"Promotion {MaKM} deleted"}


@router.post("/{MaKM}/products", status_code=201)
def add_product_to_promotion(MaKM: str, data: ProductPromotionAdd, db: Session = Depends(get_db), current_user: dict = Depends(require_role("Quản lý"))):
    promo = db.query(KhuyenMai).filter(KhuyenMai.MaKM == MaKM).first()
    if not promo:
        raise HTTPException(status_code=404, detail="Promotion not found")

    product = db.query(SanPham).filter(SanPham.MaSP == data.MaSP).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = db.query(ApDungKM).filter(ApDungKM.MaKM == MaKM, ApDungKM.MaSP == data.MaSP).first()
    if existing:
        raise HTTPException(status_code=400, detail="Product already in this promotion")

    mapping = ApDungKM(MaKM=MaKM, MaSP=data.MaSP, MucGiam=data.MucGiam)
    db.add(mapping)
    db.commit()
    return {"message": f"Product {data.MaSP} added to promotion {MaKM}", "MucGiam": data.MucGiam}


@router.delete("/{MaKM}/products/{MaSP}")
def remove_product_from_promotion(MaKM: str, MaSP: str, db: Session = Depends(get_db), current_user: dict = Depends(require_role("Quản lý"))):
    mapping = db.query(ApDungKM).filter(ApDungKM.MaKM == MaKM, ApDungKM.MaSP == MaSP).first()
    if not mapping:
        raise HTTPException(status_code=404, detail="Product not in this promotion")

    db.delete(mapping)
    db.commit()
    return {"message": f"Product {MaSP} removed from promotion {MaKM}"}

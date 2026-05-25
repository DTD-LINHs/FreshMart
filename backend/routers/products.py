import os
import uuid
from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.dependencies import get_current_user, require_role
from backend.models.sanpham import SanPham
from backend.models.khuyenmai import KhuyenMai
from backend.models.ap_dung_km import ApDungKM
from backend.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductDiscountResponse,
)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "assets", "products")

router = APIRouter(prefix="/api/products", tags=["Products"])


@router.get("", response_model=list[ProductResponse])
def get_products(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(SanPham)
    if category:
        query = query.filter(SanPham.MaNhom == category)
    if search:
        query = query.filter(SanPham.TenSP.ilike(f"%{search}%"))
    return query.all()


@router.get("/{MaSP}", response_model=ProductResponse)
def get_product(MaSP: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    product = db.query(SanPham).filter(SanPham.MaSP == MaSP).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("", response_model=ProductResponse, status_code=201)
def create_product(product: ProductCreate, db: Session = Depends(get_db), current_user: dict = Depends(require_role("Quản lý", "Kho"))):
    existing = db.query(SanPham).filter(SanPham.MaSP == product.MaSP).first()
    if existing:
        raise HTTPException(status_code=400, detail="Product ID already exists")
    db_product = SanPham(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


@router.put("/{MaSP}", response_model=ProductResponse)
def update_product(MaSP: str, product: ProductUpdate, db: Session = Depends(get_db), current_user: dict = Depends(require_role("Quản lý", "Kho"))):
    db_product = db.query(SanPham).filter(SanPham.MaSP == MaSP).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    update_data = product.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product


@router.delete("/{MaSP}")
def delete_product(MaSP: str, db: Session = Depends(get_db), current_user: dict = Depends(require_role("Quản lý"))):
    db_product = db.query(SanPham).filter(SanPham.MaSP == MaSP).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return {"message": f"Product {MaSP} deleted"}


@router.post("/{MaSP}/upload-image")
def upload_product_image(MaSP: str, file: UploadFile = File(...), db: Session = Depends(get_db), current_user: dict = Depends(require_role("Quản lý", "Kho"))):
    db_product = db.query(SanPham).filter(SanPham.MaSP == MaSP).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Delete old image if exists
    if db_product.HinhAnh:
        old_path = os.path.join(os.path.abspath(UPLOAD_DIR), os.path.basename(db_product.HinhAnh))
        if os.path.exists(old_path):
            os.remove(old_path)

    ext = os.path.splitext(file.filename)[1] or ".jpg"
    filename = f"{MaSP}_{uuid.uuid4().hex[:8]}{ext}"
    filepath = os.path.join(os.path.abspath(UPLOAD_DIR), filename)
    os.makedirs(os.path.dirname(filepath), exist_ok=True)

    with open(filepath, "wb") as f:
        f.write(file.file.read())

    relative_path = f"assets/products/{filename}"
    db_product.HinhAnh = relative_path
    db.commit()
    db.refresh(db_product)

    return {"HinhAnh": relative_path}


@router.get("/{MaSP}/discount", response_model=Optional[ProductDiscountResponse])
def get_product_discount(MaSP: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    today = date.today()
    result = (
        db.query(ApDungKM, KhuyenMai)
        .join(KhuyenMai, ApDungKM.MaKM == KhuyenMai.MaKM)
        .filter(
            ApDungKM.MaSP == MaSP,
            KhuyenMai.NgayBatDau <= today,
            KhuyenMai.NgayKetThuc >= today,
        )
        .first()
    )
    if not result:
        return None
    ap, km = result
    return ProductDiscountResponse(
        MaSP=MaSP, MucGiam=ap.MucGiam, TenKM=km.TenKM, MaKM=km.MaKM
    )

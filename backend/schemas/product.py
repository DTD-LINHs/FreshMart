from pydantic import BaseModel
from datetime import date
from typing import Optional


class ProductCreate(BaseModel):
    MaSP: str
    TenSP: str
    DonViTinh: Optional[str] = None
    GiaBan: float
    SoLuongTon: int = 0
    HSD: Optional[date] = None
    MaNhom: str
    HinhAnh: Optional[str] = None


class ProductUpdate(BaseModel):
    TenSP: Optional[str] = None
    DonViTinh: Optional[str] = None
    GiaBan: Optional[float] = None
    SoLuongTon: Optional[int] = None
    HSD: Optional[date] = None
    MaNhom: Optional[str] = None
    HinhAnh: Optional[str] = None


class ProductResponse(BaseModel):
    MaSP: str
    TenSP: str
    DonViTinh: Optional[str] = None
    GiaBan: float
    SoLuongTon: int
    HSD: Optional[date] = None
    MaNhom: str
    HinhAnh: Optional[str] = None

    class Config:
        from_attributes = True


class ProductDiscountResponse(BaseModel):
    MaSP: str
    MucGiam: float
    TenKM: str
    MaKM: str

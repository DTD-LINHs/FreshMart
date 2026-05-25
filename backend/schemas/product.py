from pydantic import BaseModel, Field
from datetime import date
from typing import Optional


class ProductCreate(BaseModel):
    MaSP: str = Field(min_length=1)
    TenSP: str = Field(min_length=1, max_length=100)
    DonViTinh: Optional[str] = None
    GiaBan: float = Field(gt=0)
    SoLuongTon: int = Field(default=0, ge=0)
    HSD: Optional[date] = None
    MaNhom: str = Field(min_length=1)
    HinhAnh: Optional[str] = None


class ProductUpdate(BaseModel):
    TenSP: Optional[str] = Field(None, min_length=1, max_length=100)
    DonViTinh: Optional[str] = None
    GiaBan: Optional[float] = Field(None, gt=0)
    SoLuongTon: Optional[int] = Field(None, ge=0)
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

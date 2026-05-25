from pydantic import BaseModel, Field
from datetime import date
from typing import Optional


class PromotionResponse(BaseModel):
    MaKM: str
    TenKM: str
    NgayBatDau: date
    NgayKetThuc: date

    class Config:
        from_attributes = True


class PromotionDetailResponse(BaseModel):
    MaKM: str
    TenKM: str
    NgayBatDau: date
    NgayKetThuc: date
    products: list[dict] = []


class PromotionCreate(BaseModel):
    TenKM: str = Field(min_length=1, max_length=100)
    NgayBatDau: date
    NgayKetThuc: date


class PromotionUpdate(BaseModel):
    TenKM: Optional[str] = Field(None, min_length=1, max_length=100)
    NgayBatDau: Optional[date] = None
    NgayKetThuc: Optional[date] = None


class ProductPromotionAdd(BaseModel):
    MaSP: str = Field(min_length=1)
    MucGiam: float = Field(gt=0)

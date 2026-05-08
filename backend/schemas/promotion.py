from pydantic import BaseModel
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

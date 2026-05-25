from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class InvoiceItem(BaseModel):
    MaSP: str = Field(min_length=1)
    SoLuong: int = Field(gt=0)


class InvoiceCreate(BaseModel):
    MaNV: str = Field(min_length=1)
    MaKH: str = Field(min_length=1)
    MaPT: str = Field(min_length=1)
    items: list[InvoiceItem] = Field(min_length=1)
    points_used: int = Field(default=0, ge=0)


class InvoiceDetailResponse(BaseModel):
    MaHD: str
    MaSP: str
    SoLuong: int
    DonGia: float
    TenSP: Optional[str] = None
    HinhAnh: Optional[str] = None

    class Config:
        from_attributes = True


class InvoiceResponse(BaseModel):
    MaHD: str
    NgayLap: datetime
    TongTien: float
    MaNV: str
    MaKH: str
    MaPT: str

    class Config:
        from_attributes = True


class InvoiceFullResponse(BaseModel):
    MaHD: str
    NgayLap: datetime
    TongTien: float
    MaNV: str
    MaKH: str
    MaPT: str
    employee_name: Optional[str] = None
    customer_name: Optional[str] = None
    payment_name: Optional[str] = None
    items: list[InvoiceDetailResponse] = []


class CheckoutResponse(BaseModel):
    MaHD: str
    subtotal: float
    discount: float
    points_discount: float
    tax: float
    total: float
    points_earned: int
    points_used: int
    new_tier: str

from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class InvoiceItem(BaseModel):
    MaSP: str
    SoLuong: int


class InvoiceCreate(BaseModel):
    MaNV: str
    MaKH: str
    MaPT: str
    items: list[InvoiceItem]
    points_used: int = 0


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

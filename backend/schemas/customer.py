from pydantic import BaseModel
from typing import Optional


class CustomerCreate(BaseModel):
    MaKH: str
    HoTen: str
    SDT: str
    DiemTichLuy: int = 0
    HangThanhVien: str = "Đồng"


class CustomerResponse(BaseModel):
    MaKH: str
    HoTen: str
    SDT: str
    DiemTichLuy: int
    HangThanhVien: Optional[str] = None

    class Config:
        from_attributes = True

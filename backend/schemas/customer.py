from pydantic import BaseModel, Field
from typing import Optional


class CustomerCreate(BaseModel):
    MaKH: str = Field(min_length=1)
    HoTen: str = Field(min_length=1, max_length=100)
    SDT: str = Field(pattern=r"^0\d{9}$")
    DiemTichLuy: int = Field(default=0, ge=0)
    HangThanhVien: str = "Đồng"


class CustomerResponse(BaseModel):
    MaKH: str
    HoTen: str
    SDT: str
    DiemTichLuy: int
    HangThanhVien: Optional[str] = None

    class Config:
        from_attributes = True

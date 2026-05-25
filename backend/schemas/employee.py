from pydantic import BaseModel, Field
from datetime import date
from typing import Optional


class EmployeeResponse(BaseModel):
    MaNV: str
    HoTen: str
    ChucVu: Optional[str] = None
    SDT: Optional[str] = None
    NgayVaoLam: date

    class Config:
        from_attributes = True


class EmployeeUpdate(BaseModel):
    HoTen: Optional[str] = Field(None, min_length=1)
    ChucVu: Optional[str] = None
    SDT: Optional[str] = Field(None, pattern=r"^0\d{9}$")
    password: Optional[str] = None

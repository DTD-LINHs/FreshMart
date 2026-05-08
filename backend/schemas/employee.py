from pydantic import BaseModel
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
    HoTen: Optional[str] = None
    ChucVu: Optional[str] = None
    SDT: Optional[str] = None
    password: Optional[str] = None

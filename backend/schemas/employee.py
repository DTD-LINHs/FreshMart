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


class EmployeeCreate(BaseModel):
    HoTen: str = Field(min_length=1, max_length=100)
    ChucVu: str = Field(min_length=1)
    SDT: str = Field(pattern=r"^0\d{9}$")
    password: str = Field(min_length=6)
    NgayVaoLam: Optional[date] = None


class EmployeeUpdate(BaseModel):
    HoTen: Optional[str] = Field(None, min_length=1)
    ChucVu: Optional[str] = None
    SDT: Optional[str] = Field(None, pattern=r"^0\d{9}$")
    password: Optional[str] = None


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(min_length=1)
    new_password: str = Field(min_length=6)

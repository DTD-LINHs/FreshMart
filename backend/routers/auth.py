from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt

from backend.database import get_db
from backend.config import settings
from backend.models.nhanvien import NhanVien
from backend.schemas.auth import LoginRequest, LoginResponse

router = APIRouter(prefix="/api/auth", tags=["Auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post("/login", response_model=LoginResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    employee = db.query(NhanVien).filter(NhanVien.MaNV == req.MaNV).first()
    if not employee:
        raise HTTPException(status_code=401, detail="Invalid employee ID or password")

    if not employee.MatKhau:
        raise HTTPException(status_code=401, detail="Password not set for this employee")

    if not pwd_context.verify(req.password, employee.MatKhau):
        raise HTTPException(status_code=401, detail="Invalid employee ID or password")

    token = create_access_token({"sub": employee.MaNV})
    return LoginResponse(
        access_token=token,
        employee={
            "MaNV": employee.MaNV,
            "HoTen": employee.HoTen,
            "ChucVu": employee.ChucVu,
            "SDT": employee.SDT,
            "NgayVaoLam": str(employee.NgayVaoLam),
        },
    )


@router.post("/set-password")
def set_password(MaNV: str, password: str, db: Session = Depends(get_db)):
    """Utility endpoint to set password for an employee. Remove or protect in production."""
    employee = db.query(NhanVien).filter(NhanVien.MaNV == MaNV).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    employee.MatKhau = pwd_context.hash(password)
    db.commit()
    return {"message": f"Password set for {MaNV}"}

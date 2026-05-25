from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from passlib.context import CryptContext

from backend.database import get_db
from backend.dependencies import get_current_user, require_role
from backend.models.nhanvien import NhanVien
from backend.schemas.employee import EmployeeResponse, EmployeeUpdate, EmployeeCreate, ChangePasswordRequest

router = APIRouter(prefix="/api/employees", tags=["Employees"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

MANAGER = "Quản lý"


@router.get("", response_model=list[EmployeeResponse])
def list_employees(db: Session = Depends(get_db), current_user: dict = Depends(require_role(MANAGER))):
    return db.query(NhanVien).order_by(NhanVien.MaNV).all()


@router.post("/me/change-password")
def change_password(data: ChangePasswordRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    employee = db.query(NhanVien).filter(NhanVien.MaNV == current_user["MaNV"]).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    if not pwd_context.verify(data.current_password, employee.MatKhau):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    employee.MatKhau = pwd_context.hash(data.new_password)
    db.commit()
    return {"message": "Password changed successfully"}


@router.get("/{MaNV}", response_model=EmployeeResponse)
def get_employee(MaNV: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    employee = db.query(NhanVien).filter(NhanVien.MaNV == MaNV).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@router.post("", response_model=EmployeeResponse, status_code=201)
def create_employee(data: EmployeeCreate, db: Session = Depends(get_db), current_user: dict = Depends(require_role(MANAGER))):
    max_id = db.query(func.max(NhanVien.MaNV)).scalar()
    num = int(max_id.replace("NV", "")) + 1 if max_id else 1
    new_id = f"NV{num:02d}"

    employee = NhanVien(
        MaNV=new_id,
        HoTen=data.HoTen,
        ChucVu=data.ChucVu,
        SDT=data.SDT,
        NgayVaoLam=data.NgayVaoLam or date.today(),
        MatKhau=pwd_context.hash(data.password),
    )
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


@router.put("/{MaNV}", response_model=EmployeeResponse)
def update_employee(MaNV: str, data: EmployeeUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    employee = db.query(NhanVien).filter(NhanVien.MaNV == MaNV).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    is_manager = current_user["ChucVu"] == MANAGER
    is_self = current_user["MaNV"] == MaNV

    if not is_manager and not is_self:
        raise HTTPException(status_code=403, detail="Permission denied")

    update_data = data.model_dump(exclude_unset=True)

    if "ChucVu" in update_data and not is_manager:
        raise HTTPException(status_code=403, detail="Only managers can change roles")

    if "password" in update_data:
        if not is_manager and not is_self:
            raise HTTPException(status_code=403, detail="Permission denied")
        password = update_data.pop("password")
        if password:
            employee.MatKhau = pwd_context.hash(password)

    for key, value in update_data.items():
        setattr(employee, key, value)

    db.commit()
    db.refresh(employee)
    return employee


@router.post("/{MaNV}/reset-password")
def reset_password(MaNV: str, db: Session = Depends(get_db), current_user: dict = Depends(require_role(MANAGER))):
    employee = db.query(NhanVien).filter(NhanVien.MaNV == MaNV).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    default_pw = "123456"
    employee.MatKhau = pwd_context.hash(default_pw)
    db.commit()
    return {"message": f"Password reset for {MaNV}", "default_password": default_pw}

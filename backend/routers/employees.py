from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from backend.database import get_db
from backend.dependencies import get_current_user
from backend.models.nhanvien import NhanVien
from backend.schemas.employee import EmployeeResponse, EmployeeUpdate

router = APIRouter(prefix="/api/employees", tags=["Employees"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.get("/{MaNV}", response_model=EmployeeResponse)
def get_employee(MaNV: str, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    employee = db.query(NhanVien).filter(NhanVien.MaNV == MaNV).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@router.put("/{MaNV}", response_model=EmployeeResponse)
def update_employee(MaNV: str, data: EmployeeUpdate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    employee = db.query(NhanVien).filter(NhanVien.MaNV == MaNV).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    update_data = data.model_dump(exclude_unset=True)
    if "password" in update_data:
        password = update_data.pop("password")
        if password:
            employee.MatKhau = pwd_context.hash(password)

    for key, value in update_data.items():
        setattr(employee, key, value)

    db.commit()
    db.refresh(employee)
    return employee

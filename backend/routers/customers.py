from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.dependencies import get_current_user
from backend.models.khachhang import KhachHang
from backend.schemas.customer import CustomerCreate, CustomerResponse

router = APIRouter(prefix="/api/customers", tags=["Customers"])


@router.get("/phone/{SDT}", response_model=CustomerResponse)
def get_customer_by_phone(SDT: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    customer = db.query(KhachHang).filter(KhachHang.SDT == SDT).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@router.get("/{MaKH}", response_model=CustomerResponse)
def get_customer(MaKH: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    customer = db.query(KhachHang).filter(KhachHang.MaKH == MaKH).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@router.post("", response_model=CustomerResponse, status_code=201)
def create_customer(customer: CustomerCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    existing = db.query(KhachHang).filter(
        (KhachHang.MaKH == customer.MaKH) | (KhachHang.SDT == customer.SDT)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Customer ID or phone already exists")
    db_customer = KhachHang(**customer.model_dump())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

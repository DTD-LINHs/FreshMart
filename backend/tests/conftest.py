from datetime import date

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

from backend.database import Base, get_db
from backend.main import app
from backend.models.nhanvien import NhanVien
from backend.models.nhomhang import NhomHang
from backend.models.sanpham import SanPham
from backend.models.khachhang import KhachHang
from backend.models.phuongthuctt import PhuongThucTT

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

engine = create_engine("sqlite:///./test.db", connect_args={"check_same_thread": False})
TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db():
    session = TestingSession()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client(db):
    def override():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture
def seed_data(db):
    emp = NhanVien(
        MaNV="NV01",
        HoTen="Test Employee",
        ChucVu="Cashier",
        SDT="0123456789",
        NgayVaoLam=date(2024, 1, 1),
        MatKhau=pwd_context.hash("password123"),
    )
    category = NhomHang(MaNhom="NH01", TenNhom="Fruits", GhiChu="Fresh fruits")
    product = SanPham(
        MaSP="SP01",
        TenSP="Apple",
        DonViTinh="kg",
        GiaBan=50000,
        SoLuongTon=100,
        HSD=date(2026, 12, 31),
        MaNhom="NH01",
    )
    customer = KhachHang(
        MaKH="KH01",
        HoTen="Test Customer",
        SDT="0987654321",
        DiemTichLuy=500,
        HangThanhVien="Đồng",
    )
    payment = PhuongThucTT(MaPT="PT01", TenPT="Cash", MoTa="Pay with cash")
    db.add_all([emp, category, product, customer, payment])
    db.commit()
    return {"employee": emp, "category": category, "product": product, "customer": customer, "payment": payment}


@pytest.fixture
def auth_headers(client, seed_data):
    resp = client.post("/api/auth/login", json={"MaNV": "NV01", "password": "password123"})
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

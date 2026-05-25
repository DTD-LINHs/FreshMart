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
from backend.models.khuyenmai import KhuyenMai
from backend.models.ap_dung_km import ApDungKM

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
        HoTen="Test Manager",
        ChucVu="Quản lý",
        SDT="0123456789",
        NgayVaoLam=date(2024, 1, 1),
        MatKhau=pwd_context.hash("password123"),
    )
    cashier = NhanVien(
        MaNV="NV02",
        HoTen="Test Cashier",
        ChucVu="Thu ngân",
        SDT="0111222333",
        NgayVaoLam=date(2024, 6, 1),
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
    promo = KhuyenMai(
        MaKM="KM01",
        TenKM="Summer Sale",
        NgayBatDau=date(2026, 1, 1),
        NgayKetThuc=date(2026, 12, 31),
    )
    promo_mapping = ApDungKM(MaKM="KM01", MaSP="SP01", MucGiam=5000)
    db.add_all([emp, cashier, category, product, customer, payment, promo, promo_mapping])
    db.commit()
    return {
        "employee": emp, "cashier": cashier, "category": category, "product": product,
        "customer": customer, "payment": payment,
        "promotion": promo, "promo_mapping": promo_mapping,
    }


@pytest.fixture
def auth_headers(client, seed_data):
    resp = client.post("/api/auth/login", json={"MaNV": "NV01", "password": "password123"})
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def cashier_headers(client, seed_data):
    resp = client.post("/api/auth/login", json={"MaNV": "NV02", "password": "password123"})
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

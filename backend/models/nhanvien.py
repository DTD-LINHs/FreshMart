from sqlalchemy import Column, String, Date, VARCHAR
from backend.database import Base


class NhanVien(Base):
    __tablename__ = "NHANVIEN"

    MaNV = Column(VARCHAR(10), primary_key=True)
    HoTen = Column(VARCHAR(100), nullable=False)
    ChucVu = Column(VARCHAR(50))
    SDT = Column(VARCHAR(15), unique=True)
    NgayVaoLam = Column(Date, nullable=False)
    MatKhau = Column(VARCHAR(255))

from sqlalchemy import Column, VARCHAR, Integer, Date
from backend.database import Base


class KhachHang(Base):
    __tablename__ = "KHACHHANG"

    MaKH = Column(VARCHAR(10), primary_key=True)
    HoTen = Column(VARCHAR(100), nullable=False)
    SDT = Column(VARCHAR(15), unique=True)
    DiemTichLuy = Column(Integer, default=0)
    HangThanhVien = Column(VARCHAR(50))

from sqlalchemy import Column, VARCHAR, Float, DateTime, ForeignKey
from backend.database import Base


class HoaDon(Base):
    __tablename__ = "HOADON"

    MaHD = Column(VARCHAR(10), primary_key=True)
    NgayLap = Column(DateTime, nullable=False)
    TongTien = Column(Float)
    MaNV = Column(VARCHAR(10), ForeignKey("NHANVIEN.MaNV"), nullable=False)
    MaKH = Column(VARCHAR(10), ForeignKey("KHACHHANG.MaKH"), nullable=False)
    MaPT = Column(VARCHAR(10), ForeignKey("PHUONGTHUCTT.MaPT"), nullable=False)

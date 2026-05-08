from sqlalchemy import Column, VARCHAR, Float, Integer, ForeignKey
from backend.database import Base


class ChiTietHoaDon(Base):
    __tablename__ = "CHITIETHOADON"

    MaHD = Column(VARCHAR(10), ForeignKey("HOADON.MaHD"), primary_key=True)
    MaSP = Column(VARCHAR(10), ForeignKey("SANPHAM.MaSP"), primary_key=True)
    SoLuong = Column(Integer)
    DonGia = Column(Float)

from sqlalchemy import Column, VARCHAR, Float, Integer, ForeignKey
from backend.database import Base


class ChiTietPhieuNhap(Base):
    __tablename__ = "CHITIETPHIEUNHAP"

    MaPN = Column(VARCHAR(10), ForeignKey("PHIEUNHAP.MaPN"), primary_key=True)
    MaSP = Column(VARCHAR(10), ForeignKey("SANPHAM.MaSP"), primary_key=True)
    SoLuongNhap = Column(Integer)
    DonGiaNhap = Column(Float)
    GhiChu = Column(VARCHAR(200))

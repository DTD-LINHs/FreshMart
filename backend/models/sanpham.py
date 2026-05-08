from sqlalchemy import Column, VARCHAR, Float, Integer, Date, ForeignKey
from backend.database import Base


class SanPham(Base):
    __tablename__ = "SANPHAM"

    MaSP = Column(VARCHAR(10), primary_key=True)
    TenSP = Column(VARCHAR(100), nullable=False)
    DonViTinh = Column(VARCHAR(20))
    GiaBan = Column(Float)
    SoLuongTon = Column(Integer)
    HSD = Column(Date)
    MaNhom = Column(VARCHAR(10), ForeignKey("NHOMHANG.MaNhom"), nullable=False)
    HinhAnh = Column(VARCHAR(500))

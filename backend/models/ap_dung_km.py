from sqlalchemy import Column, VARCHAR, Float, ForeignKey
from backend.database import Base


class ApDungKM(Base):
    __tablename__ = "AP_DUNG_KM"

    MaKM = Column(VARCHAR(10), ForeignKey("KHUYENMAI.MaKM"), primary_key=True)
    MaSP = Column(VARCHAR(10), ForeignKey("SANPHAM.MaSP"), primary_key=True)
    MucGiam = Column(Float)

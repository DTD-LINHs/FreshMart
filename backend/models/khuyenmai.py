from sqlalchemy import Column, VARCHAR, Date
from backend.database import Base


class KhuyenMai(Base):
    __tablename__ = "KHUYENMAI"

    MaKM = Column(VARCHAR(10), primary_key=True)
    TenKM = Column(VARCHAR(100), nullable=False)
    NgayBatDau = Column(Date, nullable=False)
    NgayKetThuc = Column(Date, nullable=False)

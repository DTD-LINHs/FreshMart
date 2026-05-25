from sqlalchemy import Column, VARCHAR
from backend.database import Base


class NhomHang(Base):
    __tablename__ = "NHOMHANG"

    MaNhom = Column(VARCHAR(10), primary_key=True)
    TenNhom = Column(VARCHAR(100), nullable=False)
    GhiChu = Column(VARCHAR(200))

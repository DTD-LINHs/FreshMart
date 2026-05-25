from sqlalchemy import Column, VARCHAR
from backend.database import Base


class NhaCungCap(Base):
    __tablename__ = "NHACUNGCAP"

    MaNCC = Column(VARCHAR(10), primary_key=True)
    TenNCC = Column(VARCHAR(100), nullable=False)
    DiaChi = Column(VARCHAR(200))
    SDT = Column(VARCHAR(15), unique=True)
    Email = Column(VARCHAR(100), unique=True)

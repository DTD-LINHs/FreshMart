from sqlalchemy import Column, VARCHAR, Float, Date, ForeignKey
from backend.database import Base


class PhieuNhap(Base):
    __tablename__ = "PHIEUNHAP"

    MaPN = Column(VARCHAR(10), primary_key=True)
    NgayNhap = Column(Date, nullable=False)
    TongGiaTri = Column(Float)
    MaNCC = Column(VARCHAR(10), ForeignKey("NHACUNGCAP.MaNCC"), nullable=False)
    MaNV = Column(VARCHAR(10), ForeignKey("NHANVIEN.MaNV"), nullable=False)

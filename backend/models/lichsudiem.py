from sqlalchemy import Column, VARCHAR, Integer, Date, ForeignKey
from backend.database import Base


class LichSuDiem(Base):
    __tablename__ = "LICHSUDIEM"

    MaGD = Column(Integer, primary_key=True, autoincrement=True)
    MaKH = Column(VARCHAR(10), ForeignKey("KHACHHANG.MaKH"), nullable=False)
    NgayGD = Column(Date, nullable=False)
    SoDiemThayDoi = Column(Integer)

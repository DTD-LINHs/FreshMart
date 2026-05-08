from sqlalchemy import Column, VARCHAR
from backend.database import Base


class PhuongThucTT(Base):
    __tablename__ = "PHUONGTHUCTT"

    MaPT = Column(VARCHAR(10), primary_key=True)
    TenPT = Column(VARCHAR(50), nullable=False)
    MoTa = Column(VARCHAR(200))

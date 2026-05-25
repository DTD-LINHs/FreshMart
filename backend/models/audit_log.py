from sqlalchemy import Column, Integer, VARCHAR, DateTime, Text
from backend.database import Base


class AuditLog(Base):
    __tablename__ = "AUDIT_LOG"

    id = Column(Integer, primary_key=True, autoincrement=True)
    MaNV = Column(VARCHAR(10), nullable=False)
    action = Column(VARCHAR(50), nullable=False)
    target_type = Column(VARCHAR(50), nullable=False)
    target_id = Column(VARCHAR(50), nullable=False)
    details = Column(Text)
    timestamp = Column(DateTime, nullable=False)

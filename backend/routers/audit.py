from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from backend.database import get_db
from backend.dependencies import require_role
from backend.models.audit_log import AuditLog
from backend.models.nhanvien import NhanVien

router = APIRouter(prefix="/api/audit-log", tags=["Audit Log"])


@router.get("")
def get_audit_log(
    target_type: Optional[str] = Query(None),
    target_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("Quản lý")),
):
    query = db.query(AuditLog).order_by(AuditLog.timestamp.desc())
    if target_type:
        query = query.filter(AuditLog.target_type == target_type)
    if target_id:
        query = query.filter(AuditLog.target_id == target_id)

    logs = query.limit(200).all()
    result = []
    for log in logs:
        emp = db.query(NhanVien.HoTen).filter(NhanVien.MaNV == log.MaNV).scalar()
        result.append({
            "id": log.id,
            "MaNV": log.MaNV,
            "employee_name": emp,
            "action": log.action,
            "target_type": log.target_type,
            "target_id": log.target_id,
            "details": log.details,
            "timestamp": log.timestamp.isoformat() if log.timestamp else None,
        })
    return result

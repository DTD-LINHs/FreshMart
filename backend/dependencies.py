from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from backend.routers.auth import verify_token

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    payload = verify_token(credentials.credentials)
    user_id: str = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    role: str = payload.get("role", "")
    return {"MaNV": user_id, "ChucVu": role}


def require_role(*allowed_roles: str):
    def checker(current_user: dict = Depends(get_current_user)) -> dict:
        if current_user["ChucVu"] not in allowed_roles:
            raise HTTPException(status_code=403, detail="Permission denied")
        return current_user
    return checker

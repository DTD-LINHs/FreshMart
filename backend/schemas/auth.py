from pydantic import BaseModel


class LoginRequest(BaseModel):
    MaNV: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    employee: dict

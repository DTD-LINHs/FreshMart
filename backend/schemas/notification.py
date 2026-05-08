from pydantic import BaseModel


class NotificationResponse(BaseModel):
    type: str
    title: str
    message: str
    severity: str = "info"

import datetime
from pydantic import BaseModel

class Client(BaseModel):
    id: int
    wallet_id: int
    shop_id: int
    name: str
    face_id: int
    is_shop_owner: bool
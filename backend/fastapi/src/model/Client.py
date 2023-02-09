import datetime
from pydantic import BaseModel

class Client(BaseModel):
    _id: str
    wallet_id: str
    shop_id: str
    name: str
    face_id: str
    is_shop_owner: bool
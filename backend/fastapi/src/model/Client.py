import datetime
from typing import List
from pydantic import BaseModel

class Client(BaseModel):
    _id: str
    wallet_id: str
    shop_id: List[str]
    name: str
    join_date: datetime
    face_id: str
    is_shop_owner: bool
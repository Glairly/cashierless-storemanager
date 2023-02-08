import datetime
from pydantic import BaseModel

class Shop(BaseModel):
    _id: str
    wallet_id: str
    owner_id: str
    stock_id: str
    name: str
    join_date: datetime
    machine_id: str
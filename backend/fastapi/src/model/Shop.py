import datetime
from pydantic import BaseModel

class Shop(BaseModel):
    _id: str
    wallet_id: str
    owner_id: str
    stock_id: str
    name: str
    machine_id: str
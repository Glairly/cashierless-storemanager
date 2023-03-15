import datetime
from pydantic import BaseModel

class Shop(BaseModel):
    id: int
    wallet_id: int
    owner_id: int
    stock_id: int
    name: str
    machine_id: str
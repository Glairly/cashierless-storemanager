from typing import List
from pydantic import BaseModel

class Stock(BaseModel):
    _id: str
    shop_id: str
    item_id: str
    quantity: int
    active: bool
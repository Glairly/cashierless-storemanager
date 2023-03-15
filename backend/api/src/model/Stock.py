from typing import List
from pydantic import BaseModel

class Stock(BaseModel):
    id: int
    shop_id: int
    item_id: int
    quantity: int
    active: bool
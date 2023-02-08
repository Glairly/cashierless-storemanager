from typing import List
from pydantic import BaseModel

class Transaction(BaseModel):
    _id: str
    client_id: str
    shop_id: str
    item_id: List[str]
    total_items: int
    total_price: int
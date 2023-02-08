from typing import List
from pydantic import BaseModel

class Transaction(BaseModel):
    _id: str
    shop_id: str
    items_list: List[str]
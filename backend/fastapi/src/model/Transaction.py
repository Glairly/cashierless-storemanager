from typing import List
from pydantic import BaseModel

from .requests.TransactionsRequest import TransactionItem

class Transaction(BaseModel):
    _id: str
    client_id: str
    shop_id: str
    items: List[TransactionItem]
    barcodes: List[str]
    total_items: int
    total_price: float
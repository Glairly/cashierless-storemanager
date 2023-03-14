from typing import List
from ..Item import Item
from .BaseRequest import *

class TransactionItem(BaseModel):
    id: str
    item_id: str
    quantity: int
    total_price: float

class TransactionRequest(BaseRequest):
    clientId: str
    shopId: str
    items: List[TransactionItem]
    barcodes: List[str]


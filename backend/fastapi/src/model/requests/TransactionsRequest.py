from typing import List
from ..Item import Item
from .BaseRequest import *

class TransactionItem(BaseModel):
    id: str
    quantity: int

class TransactionRequest(BaseRequest):
    clientId: str
    shopId: str
    items: List[TransactionItem]
    barcodes: List[str]


from typing import List
from ..Item import Item
from .BaseRequest import *
from ..TransactionItem import TransactionItem

class TransactionRequest(BaseRequest):
    clientId: str
    shopId: str
    items: List[TransactionItem]
    barcodes: List[str]


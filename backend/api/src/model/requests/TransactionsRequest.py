from typing import List
from .BaseRequest import *

class TransactionItemRequest(BaseRequest):
    item_id: int
    quantity: int

class AnonymousTransactionRequest(BaseRequest):
    shop_id: int
    items: List[TransactionItemRequest]
    barcodes: List[str]

class TransactionRequest(AnonymousTransactionRequest):
    client_id: int
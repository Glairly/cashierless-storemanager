from typing import List, Union
from .BaseRequest import *

class TransactionItemRequest(BaseRequest):
    item_id: int
    quantity: int

class TransactionRequest(BaseRequest):
    client_id: int
    shop_id: int
    items: List[TransactionItemRequest]
    barcodes: List[str]

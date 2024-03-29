from typing import List
from .BaseRequest import *

class TransactionItemRequest(BaseRequest):
    item_id: int
    item_name: str = ""
    quantity: int

class AnonymousTransactionRequest(BaseRequest):
    shop_id: int
    items: List[TransactionItemRequest]
    barcodes: List[str]

class TransactionRequest(AnonymousTransactionRequest):
    client_id: int

class TransactionTopupRequest(BaseRequest):
    client_id: int
    total_topup: int

class WalletTransactionRequest(TransactionRequest):
    transaction_id: int
from typing import List
from ..Item import Item
from .BaseRequest import *

class TransactionRequest(BaseRequest):
    clientId: str
    shopId: str
    items: List[Item]


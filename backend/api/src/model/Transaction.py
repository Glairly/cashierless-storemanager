from typing import List
from pydantic import BaseModel

class Transaction(BaseModel):
    id: int
    client_id: int
    shop_id: int
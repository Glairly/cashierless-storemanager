from pydantic import BaseModel
import datetime

class Wallet(BaseModel):
    _id: str
    owner_id: str
    balance: int
    is_belong_to_shop: bool = False
from pydantic import BaseModel
import datetime

class Wallet(BaseModel):
    id: int
    owner_id: int
    balance: int
    is_belong_to_shop: bool = False
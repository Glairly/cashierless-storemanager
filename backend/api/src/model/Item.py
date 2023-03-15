from pydantic import BaseModel
from .ItemType import *
from datetime import datetime

class Item(BaseModel):
    id: int
    name: str
    price: float
    shop_id: int
    quantity: int
    type: int
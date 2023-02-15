from pydantic import BaseModel
from .ItemType import *
from datetime import datetime

class Item(BaseModel):
    _id: str
    name: str
    price: float
    shop_id: str
    quantity: int
    type: int
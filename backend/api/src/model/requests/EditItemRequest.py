from pydantic import BaseModel
from typing import List

class ItemRequest(BaseModel):
  id: int
  shop_id: int
  quantity: int
  name: str
  price: float
  type: int

class EditItemRequest(BaseModel):
  items: List[ItemRequest]
  shop_id: int
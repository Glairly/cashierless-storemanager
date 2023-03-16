from pydantic import BaseModel

class AddItemRequest(BaseModel):
      shop_id: int
      name: str
      price: float
      type: int
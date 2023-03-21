from pydantic import BaseModel

class AddItemTypeRequest(BaseModel):
    name: str
    base_price: float
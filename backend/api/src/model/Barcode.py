from pydantic import BaseModel

class Barcode(BaseModel):
    id: int
    item_id: int
    barcode: str
    active: bool

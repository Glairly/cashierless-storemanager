from pydantic import BaseModel

class Barcode(BaseModel):
    _id: str
    item_id: str
    barcode: str
    active: bool

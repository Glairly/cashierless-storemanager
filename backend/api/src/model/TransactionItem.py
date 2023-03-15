from pydantic import BaseModel

class TransactionItem(BaseModel):
    id: str
    item_id: str
    quantity: int
    total_price: float
    is_barcode: bool

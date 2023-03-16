from pydantic import BaseModel

class AddBarcodeRequest(BaseModel):
      value: str
      item_id: int
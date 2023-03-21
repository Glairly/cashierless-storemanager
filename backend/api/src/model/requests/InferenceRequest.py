from pydantic import BaseModel

class InferenceRequest(BaseModel):
    shop_id: int
    shouldDetectBarcode: bool = False
    file: bytes

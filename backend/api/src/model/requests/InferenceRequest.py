from fastapi import File, UploadFile
from pydantic import BaseModel

class InferenceRequest(BaseModel):
    shop_id: int
    # file: UploadFile
    file: bytes
    shouldDetectBarcode: bool = False
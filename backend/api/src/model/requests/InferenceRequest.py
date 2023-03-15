from fastapi import File, UploadFile
from pydantic import BaseModel

class InferenceRequest(BaseModel):
    shop_id: str
    file: bytes
    shouldDetectBarcode: bool = False
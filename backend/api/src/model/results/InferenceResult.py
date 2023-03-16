from typing import List
from pydantic import BaseModel

class InferenceResult(BaseModel):
    items: List[dict]
    totalPrice: float
    totalItems: int
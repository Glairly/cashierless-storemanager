from typing import List
from ..Item import *
from pydantic import BaseModel

class InferenceResult(BaseModel):
    items: List[dict]
    totalPrice: float
    totalItems: int
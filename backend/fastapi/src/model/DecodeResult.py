from pydantic import BaseModel
from .BBoxType import BBoxType

class DecodeResult(BaseModel):
    labels: list
    bboxes: list
    type: BBoxType = BBoxType.BarCode
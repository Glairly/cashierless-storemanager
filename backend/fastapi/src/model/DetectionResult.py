from pydantic import BaseModel
from .BBoxType import BBoxType

class DetectionResult(BaseModel):
    labels: list
    bboxes: list
    type: BBoxType = BBoxType.Object
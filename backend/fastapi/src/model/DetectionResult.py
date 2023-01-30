from pydantic import BaseModel

class DetectionResult(BaseModel):
    labels: list
    bboxes: list
 
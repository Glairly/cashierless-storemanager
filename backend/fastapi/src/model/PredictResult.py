from pydantic import BaseModel

class PredictResult(BaseModel):
    labels: list
    bboxes: list
 
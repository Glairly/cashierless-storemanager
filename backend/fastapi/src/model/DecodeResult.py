from pydantic import BaseModel

class DecodeResult(BaseModel):
    labels: list
    bboxes: list
 
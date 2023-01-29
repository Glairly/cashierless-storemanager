import sys
from fastapi import UploadFile
import io

sys.path.append(".")
sys.path.append("./Image_processing/libs/model.py")

from Image_processing.index import get_model
from Image_processing.libs.model import *

class Detr_facade():

    def __init__(self):
        self.model = get_model("detr_model_11cls_50ep")

    async def predict(self, file: UploadFile):
        content = await file.read()
        self.model.predict(io.BytesIO(content))

    
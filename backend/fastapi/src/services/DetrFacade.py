import sys
from PIL import Image

sys.path.append(".")
sys.path.append("./Image_processing/libs/model.py")

from Image_processing.index import get_model
from Image_processing.libs.model import *

class DetrFacade():

    def __init__(self, modelName: str  = "detr_model_11cls_50ep"):
        self.model = get_model(modelName)

    async def predict(self, file: Image.Image):
        return self.model.predict(file)

    
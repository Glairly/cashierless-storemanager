from PIL import Image
from ..object_detection.index import get_model

class DetrService():
    def __init__(self, modelName: str  = "detr_model_11cls_50ep"):
        self.__model = get_model(modelName)

    async def predict(self, file: Image.Image):
        return self.__model.predict(file)

    
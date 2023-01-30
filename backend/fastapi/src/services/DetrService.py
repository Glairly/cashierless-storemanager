from PIL import Image
from ..object_detection.index import get_model

class DetrService():
    def __init__(self, modelName: str  = "detr_model_11cls_50ep"):
        self.model = get_model(modelName)

    async def predict(self, file: Image.Image):
        return self.model.predict(file)

    
from fastapi import APIRouter, UploadFile

from ..object_detection.Detr import *
from ..object_detection.CocoDetection import *

# Libs
from ..libs.Utils import Utils

# Services
from ..services.DetrService import *
from ..services.DecoderService import *
from ..services.InferenceService import *
from ..services.ItemsService import *

# Result
from ..model.results.DetectionResult import *
from ..model.results.DecodeResult import *
from ..model.results.BaseResult import *

class InferenceController:
    router = APIRouter(prefix="/imapi/v1")

    def __init__(self, model: DecoderService, decoder: DecoderService, inferenceService: InferenceService, itemsService: ItemsService):
        self.model = model
        self.decoder = decoder
        self.inferenceService = inferenceService
        self.itemsService = itemsService

        self.router.add_api_route("/predict", self.predict, response_model=DetectionResult , methods=["POST"])
        self.router.add_api_route("/decode", self.decode_barcodes, response_model=DecodeResult , methods=["POST"])
        self.router.add_api_route("/inference", self.inference , methods=["POST"])

    async def predict(self, file: UploadFile):
        content = await Utils.deserialize_file(file)
        labels, bboxes = await self.model.predict(content)
        return DetectionResult(labels=labels, bboxes=bboxes)

    async def decode_barcodes(self, file: UploadFile):
        content = await Utils.deserialize_file(file)
        labels, bboxes = await self.decoder.predict(content);
        return DecodeResult(labels=labels, bboxes=bboxes)

    async def inference(self, file: UploadFile):
        content = await Utils.deserialize_file(file)
        m_labels, m_bboxes = await self.model.predict(content)
        d_labels, d_bboxes = await self.decoder.predict(content);

        merged = self.inferenceService.detection_qr_collision_merge(
            DetectionResult(labels=m_labels, bboxes=m_bboxes), 
            DecodeResult(labels=d_labels, bboxes=d_bboxes)
        )
        print(merged[2].label)
        return self.itemsService.getItem_by_BBoxes(merged)







    
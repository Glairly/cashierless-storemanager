from functools import reduce
from ..model.requests.InferenceRequest import InferenceRequest
from fastapi import APIRouter, UploadFile, HTTPException
from fastapi.responses import JSONResponse

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
from ..model.results.InferenceResult import *

class InferenceController:
    router = APIRouter(prefix="/imapi/v1")

    def __init__(self, model: DetrService, decoder: DecoderService, inferenceService: InferenceService, itemsService: ItemsService):
        self.model = model
        self.decoder = decoder
        self.inferenceService = inferenceService
        self.itemsService = itemsService

        self.router.add_api_route("/predict", self.predict, response_model=DetectionResult , methods=["POST"])
        self.router.add_api_route("/decode", self.decode_barcodes, response_model=DecodeResult , methods=["POST"])
        self.router.add_api_route("/inference", self.inference, response_model=InferenceResult, methods=["POST"])

    async def predict(self, file: UploadFile):
        content = await Utils.deserialize_file(file)
        labels, bboxes = await self.model.predict(content)
        return DetectionResult(labels=labels, bboxes=bboxes)

    async def decode_barcodes(self, file: UploadFile):
        content = await Utils.deserialize_file(file)
        labels, bboxes = await self.decoder.predict(content);
        return DecodeResult(labels=labels, bboxes=bboxes)

    # async def inference(self, request: InferenceRequest):
    async def inference(self, shop_id: int, file: UploadFile):
        # file = request.file
        shouldDetectBarcode = False
        # shop_id = request.shop_id

        try:
            content = await Utils.deserialize_file(file)
            # content = await Utils.deserialize_bytes(file)
            m_labels, m_bboxes = await self.model.predict(content)
            if shouldDetectBarcode:
                d_labels, d_bboxes = await self.decoder.predict(content);
            else:
                d_labels, d_bboxes = [], []

            merged = self.inferenceService.detection_qr_collision_merge(
                DetectionResult(labels=m_labels, bboxes=m_bboxes), 
                DecodeResult(labels=d_labels, bboxes=d_bboxes)
            )
            results, totalPrice, totalItems = self.itemsService.get_item_by_bboxes(shop_id, merged)
            return JSONResponse(
                status_code=200, 
                content=dict(InferenceResult(
                    items=[x.to_dict() for x in results], 
                    totalPrice=totalPrice,
                    totalItems=totalItems
                    ))
                )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e.args[0]))
# To run
# uvicorn --app-dir=fastapi app:app --reload  
# From root
import sys

# add our module to top level 
# do not remove
from src.object_detection.Detr import Detr, collate_fn
from src.object_detection.CocoDetection import CocoDetection 

setattr(sys.modules['__main__'], 'Detr', Detr)
setattr(sys.modules['__main__'], 'CocoDetection', CocoDetection)
setattr(sys.modules['__main__'], 'collate_fn', collate_fn)

# Libs
from fastapi import FastAPI, UploadFile
from src.libs.Utils import Utils

# Services
from src.services.DetrFacade import *
from src.services.DecoderFacade import *
from src.services.InferenceService import *

# Result
from src.model.DetectionResult import *
from src.model.DecodeResult import *


app = FastAPI(swagger_ui_parameters={"displayRequestDuration": True})
model = DetrFacade()
decoder = DecoderFacade()
inferenceService = InferenceService()

@app.get("/")
async def main():
    return "Hello world"

@app.post("/predict", response_model=DetectionResult)
async def predict(file: UploadFile):
    content = await Utils.deserialize_file(file)
    labels, bboxes = await model.predict(content)
    return DetectionResult(labels=labels, bboxes=bboxes)


@app.post("/decode", response_model=DecodeResult)
async def decode_barcodes(file: UploadFile):
    content = await Utils.deserialize_file(file)
    labels, bboxes = await decoder.predict(content);
    return DecodeResult(labels=labels, bboxes=bboxes)


@app.post("/inference")
async def inference(file: UploadFile):
    content = await Utils.deserialize_file(file)
    m_labels, m_bboxes = await model.predict(content)
    d_labels, d_bboxes = await decoder.predict(content);

    # return inferenceService.detection_qr_collision_merge(
    #     DetectionResult(labels=["Oishi_Yellow", "Oishi_Yellow"], bboxes=[[10,10,20,20], [10,10,40,40]]), 
    #     DecodeResult(labels=["Oishi_Yellow"], bboxes=[[12,12,17,17]])
    #     )  

    return  DetectionResult(labels=m_labels, bboxes=m_bboxes), DecodeResult(labels=d_labels, bboxes=d_bboxes)


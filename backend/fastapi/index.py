# To run
# uvicorn --app-dir=backend/fastapi index:app --reload  
# From root
import sys
sys.path.append(".")

# add our module to top level 
# do not remove
from Image_processing.libs.model import *
setattr(sys.modules['__main__'], 'Detr', Detr.Detr)
setattr(sys.modules['__main__'], 'CocoDetection', CocoDetection.CocoDetection)
setattr(sys.modules['__main__'], 'collate_fn', Detr.collate_fn)

# Libs
from fastapi import FastAPI, UploadFile

# Facade
from src.inference.DetrFacade import *
from src.inference.DecoderFacade import *

# Result
from src.model.PredictResult import *
from src.model.DecodeResult import *


app = FastAPI(swagger_ui_parameters={"displayRequestDuration": True})
model = DetrFacade()
decoder = DecoderFacade()

@app.get("/")
async def main():
    return "Hello world"

@app.post("/predict", response_model=PredictResult)
async def predict(file: UploadFile):
    # Pre-process the input data and pass it to the model
    labels, bboxes = await model.predict(file)
    return PredictResult(labels=labels, bboxes=bboxes)


@app.post("/decode", response_model=DecodeResult)
async def decode_barcodes(file: UploadFile):
    labels, bboxes = await decoder.predict(file);
    return DecodeResult(labels=labels, bboxes=bboxes)


@app.post("/inference")
async def inference(file: UploadFile):
    return  await model.predict(file), await decoder.predict(file), 
# To run
# uvicorn --app-dir=backend/fastapi index:app --reload  
# From root
import sys
sys.path.append(".")
from src.inference.index import *
from Image_processing.libs.model import *

setattr(sys.modules['__main__'], 'Detr', Detr.Detr)
setattr(sys.modules['__main__'], 'CocoDetection', CocoDetection.CocoDetection)
setattr(sys.modules['__main__'], 'collate_fn', Detr.collate_fn)

from fastapi import FastAPI, File, UploadFile
import numpy as np
import cv2
from pyzbar.pyzbar import decode

app = FastAPI()
model = Detr_facade()

@app.get("/")
async def main():
    return "Hello world"

@app.post("/predict")
async def predict(file: UploadFile):
    # Pre-process the input data and pass it to the model
    prediction = await model.predict(file)
    return prediction


@app.post("/decode")
async def decode_barcodes(file: UploadFile):
    # Load the image data from the request
    image_data = await file.read()
    # Convert the image data to a NumPy array
    image = cv2.imdecode(np.fromstring(image_data, np.uint8), cv2.IMREAD_UNCHANGED)

    # Detect and decode barcodes in the image
    barcodes = decode(image)

    # Return the decoded barcodes
    return barcodes
from fastapi import FastAPI, File, UploadFile
from fastapi import FastAPI, File, UploadFile
import numpy as np
import cv2
from pyzbar.pyzbar import decode

app = FastAPI()

model = None
feature_extractor = None

@app.post("/predict")
async def predict(file: UploadFile):
    # Pre-process the input data and pass it to the model
    processed_data = feature_extractor(file)
    prediction = model.predict(processed_data)
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
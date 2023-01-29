from pyzbar.pyzbar import decode
import cv2
import numpy as np
from fastapi import UploadFile

class DecoderFacade():

    def __init__(self):
        pass

    async def predict(self, file: UploadFile):
        # Load the image data from the request
        image_data = await file.read()
        # Convert the image data to a NumPy array
        image = cv2.imdecode(np.fromstring(image_data, np.uint8), cv2.IMREAD_UNCHANGED)

        # Detect and decode barcodes in the image
        barcodes = decode(image)

        # Return the decoded barcodes
        labels = list(map(lambda x: x[0], barcodes))
        bboxes = list(map(lambda x: x[2], barcodes))

        return labels, bboxes

    
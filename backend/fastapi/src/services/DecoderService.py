from pyzbar.pyzbar import decode
from PIL import Image

class DecoderService():

    def __init__(self):
        pass

    async def predict(self, file: Image.Image):
        barcodes = decode(file)
  
        # Return the decoded barcodes
        labels = list(map(lambda x: x[0], barcodes))
        bboxes = list(map(lambda x: x[2], barcodes))

        file.close()

        return labels, bboxes

    
import io
from fastapi import  UploadFile
from PIL import Image

class Utils:

    @staticmethod
    async def deserialize_file(file: UploadFile) -> Image.Image:
        content = await file.read()
        await file.close()
        return Image.open(io.BytesIO(content));
import io
from fastapi import  UploadFile
from PIL import Image
import json

class Utils:

    @staticmethod
    async def deserialize_file(file: UploadFile) -> Image.Image:
        content = await file.read()
        await file.close()
        return Image.open(io.BytesIO(content));

    @staticmethod
    async def deserialize_bytes(file: bytes) -> Image.Image:
        return Image.open(file);

    @staticmethod
    def load_config(config_file):
        with open(config_file, 'r') as f:
            config = json.load(f)
        return config
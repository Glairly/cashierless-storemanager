# To run
# uvicorn --app-dir=fastapi app:app --reload  
# From root
import sys

# add our module to top level 
# do not remove
from src.object_detection.Detr import *
from src.object_detection.CocoDetection import *

setattr(sys.modules['__main__'], 'Detr', Detr)
setattr(sys.modules['__main__'], 'CocoDetection', CocoDetection)
setattr(sys.modules['__main__'], 'collate_fn', collate_fn)

# Libs
from fastapi import FastAPI

# Router
from src.controllers.InferenceController import *
from src.controllers.ItemsController import *

from pymongo import MongoClient

# Services
from src.services.DetrService import *
from src.services.DecoderService import *
from src.services.InferenceService import *
from src.services.ItemsService import *

# Result
from src.model.DetectionResult import *
from src.model.DecodeResult import *

# lib
app = FastAPI(swagger_ui_parameters={"displayRequestDuration": True})
client = MongoClient("mongodb://localhost:27017/")
db = client["cashierless"]
collection = db["items"]

# service
model = DetrService()
decoder = DecoderService()
inferenceService = InferenceService()
itemsService = ItemsService(collection)

# api 
imapi = InferenceController(model, decoder, inferenceService)
smapi = ItemsController(itemsService)

app.include_router(imapi.router)
app.include_router(smapi.router)

@app.get("/")
async def root():
    return "Hello world"

 

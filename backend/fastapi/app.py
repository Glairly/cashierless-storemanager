# To run
# uvicorn --app-dir=fastapi app:app --reload  
# From root
import sys
import warnings

warnings.filterwarnings("ignore")

# add our module to top level 
# do not remove
from src.object_detection.Detr import *
from src.object_detection.CocoDetection import *

setattr(sys.modules['__main__'], 'Detr', Detr)
setattr(sys.modules['__main__'], 'CocoDetection', CocoDetection)
setattr(sys.modules['__main__'], 'collate_fn', collate_fn)

# Libs
from fastapi import FastAPI

from src.libs.Utils import *

# Router
from src.controllers.InferenceController import *
from src.controllers.ItemsController import *
from src.controllers.WalletController import *
from src.controllers.TransactionController import *
from src.controllers.ClientController import *

from pymongo import MongoClient

# Services
from src.services.DetrService import *
from src.services.DecoderService import *
from src.services.InferenceService import *
from src.services.ItemsService import *
from src.services.WalletService import *
from src.services.ClientService import *

# Result
from src.model.results.DetectionResult import *
from src.model.results.DecodeResult import *

# lib
# create config.json on app.py level
configs = Utils.load_config('fastapi/configs.json')

app = FastAPI(swagger_ui_parameters={"displayRequestDuration": True})
client = MongoClient(configs['mongoClientURL'])
db = client[configs['dbName']]

# service
model = DetrService()
decoder = DecoderService()
inferenceService = InferenceService()
itemsService = ItemsService(db['items'])
walletService = WalletService(db['wallets'])
clientService = ClientService(db['clients'])

# api 
imapi = InferenceController(model, decoder, inferenceService, itemsService)
smapi = ItemsController(itemsService)
fapi  = WalletController(walletService)
fapi2 = TransactionController(itemsService, walletService, clientService)
capi  = ClientController(clientService)

app.include_router(imapi.router)
app.include_router(smapi.router)
app.include_router(fapi.router)
app.include_router(fapi2.router)
app.include_router(capi.router)

@app.get("/")
async def root():
    return "Hello world"

 

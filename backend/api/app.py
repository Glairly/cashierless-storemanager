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
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi_sqlalchemy import db, DBSessionMiddleware

from src.libs.Utils import *
# Router
# from src.controllers.InferenceController import *
# from src.controllers.ItemsController import *
# from src.controllers.WalletController import *
# from src.controllers.TransactionController import *
# from src.controllers.ClientController import *
# from src.controllers.ShopController import *
# from src.controllers.AuthController import *


# Services
# from src.services.DetrService import *
# from src.services.DecoderService import *
# from src.services.InferenceService import *
# from src.services.ItemsService import *
# from src.services.WalletService import *
# from src.services.ClientService import *
# from src.services.ShopService import *
# from src.services.TransactionService import *
# from src.services.AuthService import *

# Result
# from src.model.results.DetectionResult import *
# from src.model.results.DecodeResult import *

# Middlewares
from src.middlewares.JWTMiddleware import *
from fastapi.middleware.cors import CORSMiddleware

# lib
# create config.json on app.py level
configs = Utils.load_config('fastapi/configs.json')

app = FastAPI(swagger_ui_parameters={"displayRequestDuration": True})
app.add_middleware(DBSessionMiddleware, db_url=configs['dbURL'])


# client = MongoClient(configs['mongoClientURL'])
# db = client[configs['dbName']]

# service
# model = DetrService()
# decoder = DecoderService()
# inferenceService = InferenceService()
# itemsService = ItemsService(db)
# walletService = WalletService(db)
# clientService = ClientService(db)
# shopService = ShopService(db)
# transactionService = TransactionService(db)
# authService = AuthService(db)

# # api 
# imapi = InferenceController(model, decoder, inferenceService, itemsService)
# smapi = ItemsController(itemsService)
# fapi  = WalletController(walletService)
# fapi2 = TransactionController(itemsService, walletService, clientService, shopService, transactionService)
# capi  = ClientController(clientService)
# capi2 = ShopController(shopService)
# capi3 = AuthController(authService)

# app.include_router(imapi.router)
# app.include_router(smapi.router)
# app.include_router(fapi.router)
# app.include_router(fapi2.router)
# app.include_router(capi.router)
# app.include_router(capi2.router)
# app.include_router(capi3.router)

@app.get("/")
async def root():
    return "{0}"

@app.get("/jt")
async def jwt_checker():
    return "pass"

# middleware

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


unrestrict_routes = ["/capi/v1/signin", "/capi/v1/login", "/","/docs", "/openapi.json"]

@app.middleware("http")
async def add_jwt_middleware(request: Request, call_next):
    if request.url.path in unrestrict_routes:
        return await call_next(request)
    
    try:
        return await jwt_middleware(request, call_next)
    except HTTPException as e:
        response = {"error": e.detail}
        status_code = e.status_code
        return JSONResponse(content=response, status_code=status_code)
    except Exception as e:
        return JSONResponse(content=e.args[0], status_code=500)


import uvicorn
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
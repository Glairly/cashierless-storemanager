from fastapi import APIRouter, Response

# Libs
from ..libs.Utils import Utils

# Services
from ..services.ClientService import *
from ..services.ShopService import *

# Result
from ..model.results.DetectionResult import *
from ..model.results.DecodeResult import *

from ..model.models import *
from fastapi_sqlalchemy import db

from ..model.requests.DeductDepositRequest import *

class WalletController:
    router = APIRouter(prefix="/fapi/v1")

    def __init__(self, clientService: ClientService, shopService: ShopService):
        self.__clientService = clientService
        self.__shopService = shopService

        self.router.add_api_route("/client_deduct", self.client_deduct, methods=["PUT"])
        self.router.add_api_route("/client_deposit", self.client_deposit, methods=["PUT"])
        self.router.add_api_route("/shop_deduct", self.shop_deduct, methods=["PUT"])
        self.router.add_api_route("/shop_deposit", self.shop_deposit, methods=["PUT"])


    def client_deduct(self, payload: DeductDepositRequest):
        self.__clientService.deduct_none_commit(payload.target_id, payload.amount)
        db.session.commit()

    def client_deposit(self, payload: DeductDepositRequest):
        self.__clientService.deposit_none_commit(payload.target_id, payload.amount)
        db.session.commit()
    
    def shop_deduct(self, payload: DeductDepositRequest):
        self.__shopService.deduct_none_commit(payload.target_id, payload.amount)
        db.session.commit()

    def shop_deposit(self, payload: DeductDepositRequest):
        self.__shopService.deposit_none_commit(payload.target_id, payload.amount)
        db.session.commit()
    
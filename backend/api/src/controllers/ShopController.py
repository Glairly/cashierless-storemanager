from fastapi import APIRouter

# Libs
from ..libs.Utils import Utils

# Services
from ..services.ShopService import *

# Result
from ..model.results.DetectionResult import *
from ..model.results.DecodeResult import *

from ..model.requests.ShopCreateRequest import *

class ShopController:
    router = APIRouter(prefix="/capi/v1")

    def __init__(self, shopService: ShopService):
        self.__shopService = shopService

        self.router.add_api_route("/create_shop_by_client_id", self.create_shop_by_client_id, methods=["POST"])
        self.router.add_api_route("/get_shop_by_client_id", self.get_shop_by_client_id, methods=["GET"])

    def get_shop_by_client_id(self, client_id: str):
        return self.__shopService.get_shop_by_client_id(client_id)

    def create_shop_by_client_id(self, payload: ShopCreateRequest):    
        return self.__shopService.create_shop_by_client_id(payload)
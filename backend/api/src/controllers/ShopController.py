from fastapi import APIRouter

# Libs
from ..libs.Utils import Utils

# Services
from ..services.ShopService import *

# Result
from ..model.results.DetectionResult import *
from ..model.results.DecodeResult import *

from ..model.Item import *
from ..model.exceptions.AlreadyDeactivatedException import *

class ShopController:
    router = APIRouter(prefix="/capi/v1")

    def __init__(self, shopService: ShopService):
        self.__shopService = shopService

        self.router.add_api_route("/generate_shop", self.generate_shop, methods=["POST"])

    def generate_shop(self):
        result = self.__shopService.generate_item()
        result['_id'] = str(result['_id'])
        result['owner_id'] = str(result['owner_id'])
        result['stock_id'] = str(result['stock_id'])
        result['wallet_id'] = str(result['wallet_id'])
        result['machine_id'] = str(result['machine_id'])
        return result


    
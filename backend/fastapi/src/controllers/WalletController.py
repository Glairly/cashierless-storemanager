from fastapi import APIRouter

# Libs
from ..libs.Utils import Utils

# Services
from ..services.WalletService import *

# Result
from ..model.results.DetectionResult import *
from ..model.results.DecodeResult import *
from ..model.results.BaseResult import *

from ..model.Item import *
from ..model.exceptions.AlreadyDeactivatedException import *

class WalletController:
    router = APIRouter(prefix="/fapi/v1")

    def __init__(self, walletService: WalletService):
        self.__walletService = walletService

        self.router.add_api_route("/deduct", self.deduct, methods=["PUT"])
        self.router.add_api_route("/generate", self.generate_item, methods=["POST"])

    def deduct(self, walletId: str, amount: int):
        try:
            self.__walletService.deduct(walletId, amount)
            return BaseResult(status=True, message="")
        except Exception as e:
            return BaseResult(status=False, message=e.args[0])

    def generate_item(self):
        item = self.__walletService.generate_item()
        item['_id'] = str(item['_id'])
        return item


    
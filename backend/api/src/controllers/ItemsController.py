from fastapi import APIRouter

# Libs
from ..libs.Utils import Utils

# Services
from ..services.ItemsService import *

# Result
from ..model.results.DetectionResult import *
from ..model.results.DecodeResult import *

from ..model.Item import *
from ..model.exceptions.AlreadyDeactivatedException import *

class ItemsController:
    router = APIRouter(prefix="/smapi/v1")

    def __init__(self, itemsService: ItemsService):
        self.__itemsService = itemsService

        self.router.add_api_route("/get_id", self.getItem_by_id, methods=["GET"])
        self.router.add_api_route("/get_barcode", self.getItem_by_barcode, methods=["GET"])
        self.router.add_api_route("/get_name", self.getItem_by_name, methods=["GET"])
        self.router.add_api_route("/generate", self.generate_item, methods=["POST"])

    def getItem_by_id(self, id: str):
        return self.__itemsService.getItem(id)

    def getItem_by_barcode(self, barcode: str):
        return self.__itemsService.getItem_by_barcode(barcode)

    def getItem_by_name(self, name: str):
        return self.__itemsService.getItem_by_name(name)

    def generate_item(self, shopId: str):
        self.__itemsService.generate_item(shopId)
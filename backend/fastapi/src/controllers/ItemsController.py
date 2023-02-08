from fastapi import APIRouter
from pymongo.collection import Collection

# Libs
from ..libs.Utils import Utils

# Services
from ..services.ItemsService import *

# Result
from ..model.DetectionResult import *
from ..model.DecodeResult import *
from ..model.Item import *

class ItemsController:
    router = APIRouter(prefix="/smapi/v1")

    def __init__(self, itemsService: ItemsService):
        self.__itemsService = itemsService

        self.router.add_api_route("/get_id", self.getItem_by_id, methods=["GET"])
        self.router.add_api_route("/get_barcode", self.getItem_by_barCode, methods=["GET"])
        self.router.add_api_route("/generate", self.generate_item, methods=["POST"])

    def getItem_by_id(self, id: str):
        return self.__itemsService.getItem(id)

    def getItem_by_barCode(self, barCode: str):
        return self.__itemsService.getItem_by_barCode(barCode)

    def generate_item(self):
        item = self.__itemsService.generate_item()
        return item.__dict__


    
from fastapi import APIRouter

# Libs
from ..libs.Utils import Utils

# Services
from ..services.ItemsService import *

# Result
from ..model.results.DetectionResult import *
from ..model.results.DecodeResult import *

from ..model.models import *
from ..model.exceptions.AlreadyDeactivatedException import *

class ItemsController:
    router = APIRouter(prefix="/smapi/v1")

    def __init__(self, itemsService: ItemsService):
        self.__itemsService = itemsService

        self.router.add_api_route("/add_item_to_shop", self.add_item_to_shop, methods=["POST"])
        self.router.add_api_route("/add_barcode_to_item", self.add_barcode_to_item, methods=["POST"])


    def add_item_to_shop(self, payload: AddItemRequest):
        return self.__itemsService.add_item_to_shop(payload)
    
    def add_barcode_to_item(self, payload: AddBarcodeRequest):
        return self.__itemsService.add_barcode_to_item(payload)
from fastapi import APIRouter

# Libs
from ..libs.Utils import Utils

# Services
from ..services.ItemsService import *

# Result
from ..model.results.DetectionResult import *
from ..model.results.DecodeResult import *

from ..model.models import *
from ..model.requests.AddItemTypeRequest import *

class ItemsController:
    router = APIRouter(prefix="/smapi/v1")

    def __init__(self, itemsService: ItemsService):
        self.__itemsService = itemsService

        self.router.add_api_route("/add_item_to_shop", self.add_item_to_shop, methods=["POST"])
        self.router.add_api_route("/add_barcode_to_item", self.add_barcode_to_item, methods=["POST"])
        self.router.add_api_route("/get_item_with_barcodes", self.get_item_with_barcodes, methods=["GET"])
        self.router.add_api_route("/get_item_by_barcode", self.get_item_by_barcode, methods=["GET"])
        self.router.add_api_route("/add_item_type", self.add_item_type, methods=["POST"])

    def get_item_by_barcode(self, barcode: str):
        return self.__itemsService.get_item_by_barcode(barcode)

    def get_item_with_barcodes(self, item_id: int):
        return self.__itemsService.get_item_with_barcodes(item_id)

    def add_item_to_shop(self, payload: AddItemRequest):
        return self.__itemsService.add_item_to_shop(payload)
    
    def add_barcode_to_item(self, payload: AddBarcodeRequest):
        return self.__itemsService.add_barcode_to_item(payload)
    
    def add_item_type(self, payload: AddItemTypeRequest):
        return self.__itemsService.add_item_type(payload)
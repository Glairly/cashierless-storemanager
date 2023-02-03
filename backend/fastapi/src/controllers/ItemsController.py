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
        self.itemsService = itemsService

        self.router.add_api_route("/generate", self.generate_item, methods=["POST"])

    def generate_item(self):
        item = self.itemsService.generate_item()
        return item.__dict__


    
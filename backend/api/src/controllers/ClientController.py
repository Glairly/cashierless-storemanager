from fastapi import APIRouter

# Libs
from ..libs.Utils import Utils

# Services
from ..services.ClientService import *

# Result
from ..model.results.DetectionResult import *
from ..model.results.DecodeResult import *

from ..model.Item import *
from ..model.exceptions.AlreadyDeactivatedException import *

class ClientController:
    router = APIRouter(prefix="/capi/v1")

    def __init__(self, clientService: ClientService):
        self.__clientService = clientService

        self.router.add_api_route("/generate", self.generate_item, methods=["POST"])

    def generate_item(self):
        item = self.__clientService.generate_item()
        item['_id'] = str(item['_id'])
        item['shop_id'] = str(item['shop_id'])
        item['wallet_id'] = str(item['wallet_id'])
        return item


    
from fastapi import APIRouter

# Libs
from ..libs.Utils import Utils

# Services
from ..services.ClientService import *

# Result
from ..model.results.DetectionResult import *
from ..model.results.DecodeResult import *

from ..model.requests.EditClientRequest import *

from ..model.models import *

class ClientController:
    router = APIRouter(prefix="/capi/v1")

    def __init__(self, clientService: ClientService):
        self.__clientService = clientService

        self.router.add_api_route("/get_client_by_id", self.get_client_by_id, methods=["GET"])
        self.router.add_api_route("/edit_client", self.edit_client, methods=["POST"])

    def get_client_by_id(self, id:int):
        return self.__clientService.get_client_by_id(id)

    def edit_client(self, payload: EditClientRequest):
        return self.__clientService.edit_client(payload)
    
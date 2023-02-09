from fastapi import APIRouter

# Libs
from ..libs.Utils import Utils

# Services
from ..services.WalletService import *
from ..services.ItemsService import *
from ..services.ClientService import *

# Result
from ..model.results.DetectionResult import *
from ..model.results.DecodeResult import *
from ..model.results.BaseResult import *

from ..model.requests.TransactionsRequest import TransactionRequest
from ..model.Item import *
from ..model.exceptions.AlreadyDeactivatedException import *

class TransactionController:
    router = APIRouter(prefix="/fapi/v1")

    def __init__(self, itemsService: ItemsService , walletService: WalletService, clientService: ClientService):
        self.__walletService = walletService
        self.__itemsService = itemsService
        self.__clientservice = clientService

        self.router.add_api_route("/transaction", self.do_transaction, methods=["POST"])

    def do_transaction(self, request: TransactionRequest):
        try:
            client = self.__clientservice.get_client_by_id(request.clientId)
            # should check if items is available
            totalPrice = self.__itemsService.deactivate_items(request.items)
            try:
                walletId = client['wallet_id']
                self.__walletService.deduct(walletId=walletId,amount=totalPrice)
                # after deducting should then deactive items
                return BaseResult(status=True, message="Transaction successful", data=totalPrice)
            except Exception as e:
                return BaseResult(status=False, message=e.args[0])
            
        except AlreadDeactivatedException:
            return BaseResult(status=True, message="Already Deactivate")
        except Exception as e:
            return BaseResult(status=False, message=e.args[0])



    
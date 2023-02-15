from fastapi import APIRouter, Response
from fastapi.responses import JSONResponse
# Libs
from ..libs.Utils import Utils

# Services
from ..services.WalletService import *
from ..services.ItemsService import *
from ..services.ClientService import *
from ..services.ShopService import *

# Result
from ..model.results.DetectionResult import *
from ..model.results.DecodeResult import *

from ..model.requests.TransactionsRequest import TransactionRequest
from ..model.Item import *
from ..model.exceptions.AlreadyDeactivatedException import *

class TransactionController:
    router = APIRouter(prefix="/fapi/v1")

    def __init__(self, itemsService: ItemsService , walletService: WalletService, clientService: ClientService, shopService: ShopService):
        self.__walletService = walletService
        self.__itemsService = itemsService
        self.__clientservice = clientService
        self.__shopService = shopService

        self.router.add_api_route("/transaction", self.do_transaction, methods=["POST"])

    def do_transaction(self, request: TransactionRequest):
        try:
            client = self.__clientservice.get_client_by_id(request.clientId)
            shop   = self.__shopService.get_shop_by_id(request.shopId)
            # Check if items is available
            # Get total price            
            totalPrice = self.__itemsService.transaction_getItem_list(request.items, request.barcodes)
            try:
                walletId = client['wallet_id']
                shopWalletId = shop['wallet_id']
                self.__walletService.deduct(walletId=walletId,amount=totalPrice)
                self.__walletService.deposit(walletId=shopWalletId,amount=totalPrice)
                # after deducting should then deactive items
                # deactivating items here
                self.__itemsService.transaction_deactivate_item(request.items, request.barcodes)

                return JSONResponse(status_code=200, content="Transaction successful")
            except Exception as e:
                return JSONResponse(status_code=400, content=e.args[0])
            
        except AlreadDeactivatedException:
            return JSONResponse(status_code=400, content="Already Deactivate")
        except Exception as e:
            return JSONResponse(status_code=400, content=e.args[0])
from fastapi import APIRouter, Response
from fastapi.responses import JSONResponse
# Libs
from ..libs.Utils import Utils

# Services
from ..services.WalletService import *
from ..services.ItemsService import *
from ..services.ClientService import *
from ..services.ShopService import *
from ..services.TransactionService import *

# Result
from ..model.results.DetectionResult import *
from ..model.results.DecodeResult import *

from ..model.requests.TransactionsRequest import TransactionRequest
from ..model.Item import *
from ..model.exceptions.AlreadyDeactivatedException import *
from ..model.exceptions.OutOfBalanceException import *
from ..model.exceptions.OutOfStockException import *


class TransactionController:
    router = APIRouter(prefix="/fapi/v1")

    def __init__(self, itemsService: ItemsService , walletService: WalletService, clientService: ClientService, shopService: ShopService, transactionService: TransactionService):
        self.__walletService = walletService
        self.__itemsService = itemsService
        self.__clientservice = clientService
        self.__shopService = shopService
        self.__transactionService = transactionService

        self.router.add_api_route("/do_transaction", self.do_transaction, methods=["POST"])
        self.router.add_api_route("/get_transaction_by_id", self.get_transaction_by_id, methods=["GET"])
        self.router.add_api_route("/get_transaction_by_client_id", self.get_transaction_by_client_id, methods=["GET"])
        self.router.add_api_route("/get_transaction_by_shop_id", self.get_transaction_by_shop_id, methods=["GET"])


    def do_transaction(self, request: TransactionRequest):
        try:
            client = self.__clientservice.get_client_by_id(request.clientId)
            shop   = self.__shopService.get_shop_by_id(request.shopId)
            # Check if items is available
            # Get total price     
            try:
                totalPrice, totalItems = self.__itemsService.transaction_getItem_list(request.items, request.barcodes)

                walletId = client['wallet_id']
                shopWalletId = shop['wallet_id']

                # TODO: Error handling and Retry Logic
                self.__walletService.deduct(walletId=walletId,amount=totalPrice)
                self.__walletService.deposit(walletId=shopWalletId,amount=totalPrice)
                # after deducting should then deactive items
                # deactivating items here
                self.__itemsService.transaction_deactivate_item(request.items, request.barcodes)
                self.__transactionService.create_transaction(clientId=request.clientId,shopId=request.shopId, items=request.items, barcodes= request.barcodes, total_items=totalItems, total_price=totalPrice)
                return JSONResponse(status_code=200, content="Transaction successful")
            except OutOfBalanceException as e:
                return JSONResponse(status_code=400, content=e.args[0])
            except OutOfStockException as e:
                return JSONResponse(status_code=400, content=e.args[0])
            except Exception as e:
                return JSONResponse(status_code=500, content=e.args[0])
            
        except AlreadDeactivatedException:
            return JSONResponse(status_code=400, content="Already Deactivate")
        except Exception as e:
            return JSONResponse(status_code=500, content=e.args[0])

        
    def get_transaction_by_id(self, transactionId: str) -> Transaction:
        return self.__transactionService.get_transaction_by_id(transactionId)
    
    def get_transaction_by_client_id(self, clientId: str) -> List[Transaction]:
        return self.__transactionService.get_transaction_by_client_id(clientId)
    
    def get_transaction_by_shop_id(self, shopId: str) -> List[Transaction]:
        return self.__transactionService.get_transaction_by_shop_id(shopId)
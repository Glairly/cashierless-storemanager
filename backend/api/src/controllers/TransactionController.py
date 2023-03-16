from fastapi import APIRouter, Response
from fastapi.responses import JSONResponse
# Libs
from ..libs.Utils import Utils

# Services
from ..services.ItemsService import *
from ..services.ClientService import *
from ..services.ShopService import *
from ..services.TransactionService import *

# Result
from ..model.results.DetectionResult import *
from ..model.results.DecodeResult import *

from ..model.requests.TransactionsRequest import TransactionRequest

class TransactionController:
    router = APIRouter(prefix="/fapi/v1")

    def __init__(self, itemsService: ItemsService, clientService: ClientService, shopService: ShopService, transactionService: TransactionService):
        self.__itemsService = itemsService
        self.__clientservice = clientService
        self.__shopService = shopService
        self.__transactionService = transactionService

        self.router.add_api_route("/do_transaction", self.do_transaction, methods=["POST"])

    def do_transaction(self, request: TransactionRequest):
        try:
            totalPrice, totalItems = self.__itemsService.transaction_deactivate_item(request.items, request.barcodes)

            self.__clientservice.deduct_none_commit(client_id=request.client_id,amount=totalPrice)
            self.__shopService.deposit_none_commit(shop_id=request.shop_id,amount=totalPrice)

            self.__transactionService.create_transaction_none_commit(request=request, totalPrice=totalPrice, totalItems=totalItems)
            
            db.session.commit()
            return JSONResponse(status_code=200, content="Transaction successful")
        except Exception as e:
            return JSONResponse(status_code=500, content=e.args[0])

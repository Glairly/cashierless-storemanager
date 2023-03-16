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
from ..model.exceptions.AlreadyDeactivatedException import *
from ..model.exceptions.OutOfBalanceException import *
from ..model.exceptions.OutOfStockException import *


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
            client = self.__clientservice.get_client_by_id(request.client_id)

            try:
                totalPrice, totalItems = self.__itemsService.transaction_deactivate_item(request.items, request.barcodes)

                self.__clientservice.deduct_none_commit(client_id=request.client_id,amount=totalPrice)
                self.__shopService.deposit_none_commit(shop_id=request.shop_id,amount=totalPrice)

                # TODO: add transaction to transaction table
                # self.__transactionService.create_transaction(clientId=request.clientId,shopId=request.shopId, items=request.items, barcodes= request.barcodes, total_items=totalItems, total_price=totalPrice)
                
                db.session.commit()
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
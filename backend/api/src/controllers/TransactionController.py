from fastapi import APIRouter
from fastapi.responses import JSONResponse
# Libs

# Services
from ..services.ItemsService import *
from ..services.ClientService import *
from ..services.ShopService import *
from ..services.TransactionService import *

# Result
from ..model.results.DetectionResult import *
from ..model.results.DecodeResult import *

from ..model.requests.TransactionsRequest import TransactionRequest
from ..model.requests.PendingTransactionRequest import *

from PIL import Image

class TransactionController:
    router = APIRouter(prefix="/fapi/v1")

    def __init__(self, itemsService: ItemsService, clientService: ClientService, shopService: ShopService, transactionService: TransactionService):
        self.__itemsService = itemsService
        self.__clientservice = clientService
        self.__shopService = shopService
        self.__transactionService = transactionService

        self.router.add_api_route("/do_transaction", self.do_transaction, methods=["POST"])
        self.router.add_api_route("/do_transaction_with_wallet", self.do_transaction_with_wallet, methods=["POST"])
        self.router.add_api_route("/do_anonymous_transaction", self.do_anonymous_transaction, methods=["POST"])
        self.router.add_api_route("/generate_promptpay_qr", self.generate_promptpay_qr, methods=["POST"])
        self.router.add_api_route("/generate_promptpay_qr_topup", self.generate_promptpay_qr_topup, methods=["POST"])
        self.router.add_api_route("/payment_confirm", self.payment_confirm, methods=["POST"])
        self.router.add_api_route("/topup_confirm", self.topup_confirm, methods=["POST"])
        self.router.add_api_route("/get_pending_transaction", self.get_pending_transaction, methods=["GET"])
        self.router.add_api_route("/get_pending_topup_transaction", self.get_pending_topup_transaction, methods=["GET"])
        self.router.add_api_route("/get_client_transactions", self.get_client_transactions, methods=["GET"])
        self.router.add_api_route("/topup", self.topup, methods=["POST"])

    def do_transaction(self, request: TransactionRequest):
        try:
            totalPrice, totalItems = self.__itemsService.transaction_deactivate_item(request.items, request.barcodes)
            self.__shopService.deposit_none_commit(shop_id=request.shop_id,amount=totalPrice)
            self.__transactionService.create_transaction_none_commit(request=request, totalPrice=totalPrice, totalItems=totalItems)
            db.session.commit()
            return JSONResponse(status_code=200, content="Transaction successful")
        except Exception as e:
            return JSONResponse(status_code=500, content=e.args[0])
    
    def do_transaction_with_wallet(self, request: TransactionRequest):
        try:
            totalPrice, totalItems = self.__itemsService.transaction_deactivate_item(request.items, request.barcodes)
            self.__clientservice.deduct_none_commit(client_id=request.client_id,amount=totalPrice)
            self.__shopService.deposit_none_commit(shop_id=request.shop_id,amount=totalPrice)
            self.__transactionService.create_transaction_none_commit(request=request, totalPrice=totalPrice, totalItems=totalItems)
            db.session.commit()
            return JSONResponse(status_code=200, content="Transaction successful")
        except Exception as e:
            return JSONResponse(status_code=500, content=e.args[0])

    def do_anonymous_transaction(self, request: AnonymousTransactionRequest):
        try:
            totalPrice, totalItems = self.__itemsService.transaction_deactivate_item(request.items, request.barcodes)
            self.__shopService.deposit_none_commit(shop_id=request.shop_id,amount=totalPrice)
            self.__transactionService.create_anonymous_transaction_none_commit(request=request, totalPrice=totalPrice, totalItems=totalItems)
            db.session.commit()
            return JSONResponse(status_code=200, content="Transaction successful")
        except Exception as e:
            return JSONResponse(status_code=500, content=e.args[0])

    def generate_promptpay_qr(self, request: TransactionRequest):
        shop = self.__shopService.get_shop_by_id(shop_id=request.shop_id)
        if shop is None or shop.phone_number is None:
            raise HTTPException(status_code=400, detail="Shop is not available")
        totalPrice, _ = self.__itemsService.get_transaction_payment_info(request.items, request.barcodes)
        return self.__transactionService.generate_promptpay_qr(shop.id, shop.phone_number, totalPrice)
    
    def generate_promptpay_qr_topup(self, request:TransactionTopupRequest):
        return self.__transactionService.generate_promptpay_pr_topup(request.client_id, request.total_topup)

    def payment_confirm(self, request: PendingTransactionRequest):
        return self.__transactionService.edit_transaction_status(int(request.transactionId), request.status)
    
    def topup_confirm(self, request: PendingTopupTransactionRequest):
        return self.__transactionService.edit_topup_transaction_status(int(request.transactionId), request.status)
    
    def get_pending_transaction(self, pending_transaction_id: int):
        return self.__transactionService.get_pending_transaction_status(pending_transaction_id)
    
    def get_pending_topup_transaction(self, pending_topup_transaction_id: int):
        return self.__transactionService.get_pending_topup_transaction_status(pending_topup_transaction_id)
    
    def get_client_transactions(self, client_id: int):
        return self.__transactionService.get_client_transactions(client_id)
    
    def topup(self, request: TransactionTopupRequest):
        return self.__transactionService.create_transaction_for_topup(request, totalPrice)
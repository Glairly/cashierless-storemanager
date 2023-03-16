from ..model.models import *
from fastapi_sqlalchemy import db

from sqlalchemy.orm import subqueryload

from ..model.requests.TransactionsRequest import *

class TransactionService:

    def create_transaction_none_commit(self, request: TransactionRequest, totalPrice: float, totalItems: int):
        transaction_items = []
        for item in request.items:
            tt = TransactionItem(item_id=item.item_id, quantity=item.quantity)
            db.session.add(tt)
            transaction_items.append(tt)

        for barcode in request.barcodes:
            tt = TransactionItem(item_id=barcode, quantity=1, is_barcode=True)
            db.session.add(tt)
            transaction_items.append(tt)

        transaction = Transaction(client_id=request.client_id, shop_id=request.shop_id, total_items=totalItems, total_price=totalPrice, transaction_items=transaction_items)
        db.session.add(transaction)
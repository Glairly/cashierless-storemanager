import io
from typing import Union
from fastapi import HTTPException
from ..model.models import *
from fastapi_sqlalchemy import db
from fastapi.responses import StreamingResponse, JSONResponse

from sqlalchemy.orm import subqueryload

from ..model.requests.TransactionsRequest import *
from ..model.requests.PendingTransactionRequest import *

from ..model.models import *

from promptpay import qrcode
import base64

class TransactionService:
    def generate_promptpay_qr(self, shop_id: str, phone_number:str, amount: float):   
        pending_transaction = PendingTransaction(payee_id=shop_id ,payee_account_number=phone_number, amount=amount)

        db.session.add(pending_transaction)
        db.session.commit()
        db.session.refresh(pending_transaction)

        qr = qrcode.to_image(qrcode.generate_payload(phone_number, amount))
        
        img_byte_arr = io.BytesIO()
        qr.save(img_byte_arr, format='PNG')
        img_byte_arr = img_byte_arr.getvalue()

        return  { "qrcode": base64.b64encode(img_byte_arr), "pending_transaction_id": pending_transaction.id }

    def edit_transaction_status(self, pending_transaction_id: int, status: str):
        pending_transaction = db.session.query(PendingTransaction).filter(PendingTransaction.id == pending_transaction_id).first()

        if pending_transaction is None:
            raise HTTPException(status_code=400,detail="Could not find pending transaction")
        
        pending_transaction.status = status
        db.session.commit()

        return f"Completely change transaction({pending_transaction_id}) status to {status}"

    def get_pending_transaction_status(self, pending_transaction_id:int):
        pending_transaction = db.session.query(PendingTransaction).filter(PendingTransaction.id == pending_transaction_id).first()
        if pending_transaction is None:
            raise HTTPException(status_code=400,detail="Could not find pending transaction")
        return pending_transaction

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
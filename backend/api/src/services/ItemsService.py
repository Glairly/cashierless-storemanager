from functools import reduce

from fastapi import HTTPException

from ..model.requests.AddItemRequest import *
from ..model.requests.AddBarcodeRequest import *
from ..model.requests.TransactionsRequest import *

from ..model.BBox import *
from ..model.BBoxType import *
from ..model.ItemType import *
from ..model.models import *

from fastapi_sqlalchemy import db
from sqlalchemy.orm import subqueryload

class ItemsService:

    def get_item_with_barcodes(self, item_id: int):
        item = db.session.query(Item).filter(Item.id == item_id).options(subqueryload(Item.barcodes)).first()
        return item
    
    def get_item_by_barcode(self, barcode: str):
        item = db.session.query(Item).join(Barcode).filter(Barcode.barcode == barcode).first()
        return item

    def add_item_to_shop(self, payload: AddItemRequest):
        shop = db.session.query(Shop).filter(Shop.id == payload.shop_id).first()
        if shop is None:
            raise HTTPException(status_code=404, detail="Shop not found")
        
        item = Item(name= payload.name, quantity=0, price= payload.price, type= payload.type, shop= shop)
        db.session.add(item)
        db.session.commit()
        return item
    
    def add_barcode_to_item(self, payload: AddBarcodeRequest):
        item = db.session.query(Item).filter(Item.id == payload.item_id).first()
        if item is None:
            raise HTTPException(status_code=404, detail="Item not found")
        
        barcode = Barcode(barcode= payload.value)
        item.barcodes.append(barcode)

        db.session.add(barcode)
        db.session.commit()
        return barcode
    

    def transaction_deactivate_item(self, items: List[TransactionItemRequest], barcodes: List[str]):
        totalPrice = 0
        totalItems = 0

        # Query all items
        for item in items:
            item_id = item.item_id
            quantity = item.quantity

            item = db.session.query(Item).filter(Item.id == item_id).first()

            if item is None:
                raise HTTPException(status_code=404, detail="Item not found")
            
            if item.quantity < quantity:
                raise HTTPException(status_code=400, detail="Not enough items in stock")

            totalPrice += item.price * quantity
            totalItems += quantity

            item.quantity -= quantity
        
        # Query all barcodes's items
        barcode_items = db.session.query(Item).join(Barcode).filter(Barcode.active and Barcode.barcode.in_(barcodes)).all()
        for item in barcode_items:
            if item.quantity < quantity:
                 HTTPException(status_code=400, detail="Not enough items in stock")
            
            totalPrice += item.price
            totalItems += 1

            item.quantity -= 1

        # Deactivate barcodes
        db.session.query(Barcode).filter(Barcode.active and Barcode.barcode.in_(barcodes)).update({"active": False})


        return totalPrice, totalItems
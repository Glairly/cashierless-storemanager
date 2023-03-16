from functools import reduce

from fastapi import HTTPException

from ..model.requests.AddItemRequest import *
from ..model.requests.AddBarcodeRequest import *

from ..model.BBox import *
from ..model.BBoxType import *
from ..model.ItemType import *
from ..model.models import *

from fastapi_sqlalchemy import db

class ItemsService:

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
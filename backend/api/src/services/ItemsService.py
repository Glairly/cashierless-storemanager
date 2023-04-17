from functools import reduce

from fastapi import HTTPException
from sqlalchemy import and_

from ..model.requests.AddItemRequest import *
from ..model.requests.AddBarcodeRequest import *
from ..model.requests.TransactionsRequest import *
from ..model.requests.AddItemTypeRequest import *

from ..model.BBox import *
from ..model.BBoxType import *
from ..model.models import *

from fastapi_sqlalchemy import db
from sqlalchemy.orm import subqueryload

from ..singleton.ItemType import ITEMTYPE_CACHE

class ItemsService:
    def add_item_type(self, payload: AddItemTypeRequest):
        item_type = ItemType(name= payload.name, base_price= payload.base_price)
        db.session.add(item_type)

        db.session.commit()
        db.session.refresh(item_type)

        ITEMTYPE_CACHE.fetch_all()

        return item_type

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
    
    def get_transaction_payment_info(self, items: List[TransactionItemRequest], barcodes: List[str]):
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
        
        # Query all barcodes's items
        barcode_items = db.session.query(Item).join(Barcode).filter(Barcode.active and Barcode.barcode.in_(barcodes)).all()
        for item in barcode_items:
            if item.quantity < quantity:
                 HTTPException(status_code=400, detail="Not enough items in stock")
            
            totalPrice += item.price
            totalItems += 1

        return totalPrice, totalItems


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
    
    def get_item_by_shop_id_and_type(self, shop_id: int, type: ItemType):
        return db.session.query(Item).filter(and_(Item.shop_id == shop_id, Item.type == type)).first()

    def merge_items(self, items: List[Item]):
        output_dict = {}

        for item in items:
            name = item.name
            price = item.price
            _type = item.type
            id = item.id
            if name in output_dict:
                output_dict[name].quantity += 1
            else:
                output_dict[name] = Item(id=id,name= name, quantity=1, price= price, type= _type)

        return list(output_dict.values())
        

    def get_item_by_bboxes(self, shop_id:int, bboxes: List[BBox]):
        results = []

        item_type_cache = ITEMTYPE_CACHE.to_dict()

        for bbox in bboxes:
            if bbox.type == BBoxType.barcode:
                result = self.get_item_by_barcode(barcode=bbox.label)
            else:
                result = self.get_item_by_shop_id_and_type(shop_id=shop_id, type=item_type_cache[bbox.label])

            results.append(result)
        
        totalPrice = reduce(lambda x, y: x + y.price, results, 0)
        totalItems = len(results)
        return self.merge_items(results), totalPrice, totalItems
    
    def get_all_item_type(self):
        return db.session.query(ItemType).all()
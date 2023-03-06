from functools import reduce
from typing import List

from ..model.requests.TransactionsRequest import *

from ..model.exceptions.AlreadyDeactivatedException import AlreadDeactivatedException
from ..model.exceptions.OutOfStockException import OutOfStockException
from ..model.BBox import *
from ..model.BBoxType import *
from ..model.Item import *
from ..model.ItemType import *
from faker import Faker
from datetime import datetime, timedelta
import random

from pymongo.collection import Collection 
from bson.objectid import ObjectId

class ItemsService:

    def __init__(self, itemCollection: Collection, barcodeCollection: Collection):
        self.__itemCollection = itemCollection
        self.__barcodeCollection = barcodeCollection

    def getItem_by_shop(self, shop_id: str, type: ItemType) -> List[Item]:
        result = self.__itemCollection.find_one({"shop_id": ObjectId(shop_id), "type": type.value})
        result['_id'] = str(result['_id'])
        result['shop_id'] = str(result['shop_id'])
        return result

    def getItem(self, id: str) -> Item:
        result = self.__itemCollection.find({"_id": ObjectId(id)}).next()
        result['_id'] = str(result['_id'])
        result['shop_id'] = str(result['shop_id'])
        return result

    def getItem_by_name(self, name: str) -> Item:
        result = self.__itemCollection.find({"name": name}).next()
        result['_id'] = str(result['_id'])
        return result
    
    def getItem_by_barcode(self, barcode: str) -> Item:
        result = self.__barcodeCollection.find_one({"barcode": barcode})
        return self.getItem(str(result['item_id']))
    
    def transaction_getItem_by_id_list(self, id_list: List[TransactionItem]) -> List[Item]:
        results = []
        for item in id_list:
            result = self.getItem(item.id)
            if result == None:
                raise ValueError("Item not found")
            
            if result['quantity'] < item.quantity:
                raise OutOfStockException("Item out of stock or not Enough in stock")

            result['price'] = result['price'] * item.quantity
            results.append(result)
        return results

    def transaction_getItem_by_barcode_list(self, barcode_list: List[str]) -> List[Item]:
        results = []
        for barcode in barcode_list:
            result = self.getItem_by_barcode(barcode)
            if result == None:
                raise ValueError(f"Item with barcode {barcode} not found")
            
            if not result['quantity']:
                raise OutOfStockException("Item out of stock or not Enough in stock")

            results.append(result)
        return results

    def getItem_by_BBoxes(self,shop_id: str, bboxes: List[BBox]) -> List[Item]:
        results = []
        for bbox in bboxes:
            if bbox.type == BBoxType.barcode:
                result = self.getItem_by_barcode(barcode=bbox.label)
            else:
                result = self.getItem_by_shop(shop_id=shop_id, type=ItemType[bbox.label])
            results.append(result)
        return results
    
    # TODO: if quantity is 0 then throw exception
    def transaction_getItem_list(self, id_list: List[TransactionItem], barcode_list: List[str]):
        r1 = self.transaction_getItem_by_id_list(id_list)
        r2 = self.transaction_getItem_by_barcode_list(barcode_list)
        result = r1 + r2
        totalPrice = reduce(lambda x, y: x + y['price'], result, 0)
        totalItems = reduce(lambda x, y: x + y.quantity, id_list, 0) + len(barcode_list)
        return totalPrice, totalItems
    
    def substract_item_by_id_list(self, item_list: List[TransactionItem]):
        for item in item_list:
            self.__itemCollection.find_one_and_update(
                {"_id": ObjectId(item.id)},
                {"$inc": {"quantity": -item.quantity}})

    def deacitvate_item_by_barcode_list(self, barcode_list: List[str]):
        for barcode in barcode_list:
            self.__itemCollection.find_one_and_update({"barcode": barcode}, {"$set": {"active": False}})

    def transaction_deactivate_item(self, item_list: List[TransactionItem], barcode_list: List[str]):
        self.deacitvate_item_by_barcode_list(barcode_list)
        self.substract_item_by_id_list(item_list)
 
    def add_item(self, item: Item):
        return self.__itemCollection.insert_one(item)
    
    def add_barcode(self, item_id: str, barcode: str):
        self.__barcodeCollection.insert_one({
             'item_id': item_id,
             'barcode': barcode
        })

    def generate_item(self, shopId: str):
        fake = Faker()
        name = fake.name()
        price = fake.random_int(min=10, max=100, step=1) * 1.0
        shop_id = ObjectId(shopId)
        item = {
            'name': name,
            'price': price,
            'shop_id': shop_id,
            'type': 1,
        }
        result = self.__itemCollection.insert_one(item)
        self.__barcodeCollection.insert_one({
            'item_id': result.inserted_id,
            'barcode': str(fake.random_int(min=1000000000000, max=9999999999999, step=1)),
            'active': True
        })
    
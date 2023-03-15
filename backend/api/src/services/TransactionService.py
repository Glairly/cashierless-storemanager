from typing import List

from ..model.exceptions.AlreadyDeactivatedException import AlreadDeactivatedException
from ..model.Client import *
from ..model.Transaction import *
from ..model.TransactionItem import *
from faker import Faker
from datetime import datetime, timedelta
import random

from pymongo.collection import Collection 
from bson.objectid import ObjectId


class TransactionService:
    def __init__(self, mongoClient: Collection) -> None:
        self.__mongoClient = mongoClient

    def convert_to_str(self, result: any):
        result['_id'] = str(result['_id'])
        result['client_id'] = str(result['client_id'])
        result['shop_id'] = str(result['shop_id'])
        # result['item_id'] = map(lambda x: str(x), result['item_id'])
        return result

    def get_transaction_by_id(self, _id: str) -> Transaction:
        result = self.__mongoClient.find({"_id": ObjectId(_id)}).next()
        return self.convert_to_str(result)

    def get_transaction_by_client_id(self, _id: str) -> List[Transaction]:
        cursor = self.__mongoClient.find({"client_id": ObjectId(_id)})
        results = []
        try:
            while True:
                result = cursor.next()
                results.append(self.convert_to_str(result))
        except:
            pass
        return results
    
    def get_transaction_by_shop_id(self, _id: str) -> List[Transaction]:
        cursor = self.__mongoClient.find({"shop_id": ObjectId(_id)})
        results = []
        try:
            while True:
                result = cursor.next()
                results.append(self.convert_to_str(result))
        except:
            pass
        return results
    
    def create_transaction(self, clientId: str, shopId: str, items: List[TransactionItem], barcodes: List[str], total_items: int, total_price: float):
        self.__mongoClient.insert_one({
                'client_id': ObjectId(clientId),
                'shop_id': ObjectId(shopId),
                'items': [ dict(x) for x in items],
                'barcodes': barcodes,
                'total_items': total_items,
                'total_price': total_price
        })

    
    def generate_item(self) -> Client:
        fake = Faker()
        wallet_id = ObjectId()
        shopId = ObjectId()
        name = fake.name()
        face_id = fake.random_int(min=10, max=1000)
        is_shop_owner = fake.boolean()
        item = {
            'wallet_id': wallet_id,
            'shop_id': shopId,
            'name': name,
            'face_id': face_id,
            'is_shop_owner': is_shop_owner
        }
        result = self.__mongoClient.insert_one(item)
        return self.__mongoClient.find_one({"_id": result.inserted_id})


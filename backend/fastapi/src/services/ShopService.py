from typing import List

from ..model.exceptions.AlreadyDeactivatedException import AlreadDeactivatedException
from ..model.Shop import *
from faker import Faker
from datetime import datetime, timedelta
import random

from pymongo.collection import Collection 
from bson.objectid import ObjectId


class ShopService:
    def __init__(self, mongoClient: Collection) -> None:
        self.__mongoClient = mongoClient

    def get_shop_by_id(self, _id: str) -> Shop:
        result = self.__mongoClient.find({"_id": ObjectId(_id)}).next()
        result['_id'] = str(result['_id'])
        result['owner_id'] = str(result['owner_id'])
        result['stock_id'] = str(result['stock_id'])
        result['wallet_id'] = str(result['wallet_id'])
        result['machine_id'] = str(result['machine_id'])
        return result
    
    def get_shop_by_ownerId(self, _id: str) -> Shop:
        result = self.__mongoClient.find({"owner_id": ObjectId(_id)}).next()
        result['_id'] = str(result['_id'])
        result['owner_id'] = str(result['owner_id'])
        result['stock_id'] = str(result['stock_id'])
        result['wallet_id'] = str(result['wallet_id'])
        result['machine_id'] = str(result['machine_id'])
        return result
    
    def generate_item(self) -> Shop:
        fake = Faker()
        walletId = ObjectId()
        ownerId = ObjectId()
        name = fake.name()
        stockId = ObjectId()
        machineId = ObjectId()
        item = {
            'wallet_id': walletId,
            'owner_id': ownerId,
            'name': name,
            'stock_id': stockId,
            'machine_id': machineId
        }
        result = self.__mongoClient.insert_one(item)
        return self.__mongoClient.find_one({"_id": result.inserted_id})


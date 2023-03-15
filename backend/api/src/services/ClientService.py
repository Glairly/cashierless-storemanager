from typing import List

from ..model.exceptions.AlreadyDeactivatedException import AlreadDeactivatedException
from ..model.Client import *
from faker import Faker
from datetime import datetime, timedelta
import random

from pymongo.collection import Collection 
from bson.objectid import ObjectId


class ClientService:
    def __init__(self, mongoClient: Collection) -> None:
        self.__mongoClient = mongoClient
        
    def get_client_by_id(self, _id: str) -> Client:
        result = self.__mongoClient.find({"_id": ObjectId(_id)}).next()
        result['_id'] = str(result['_id'])
        result['shop_id'] = str(result['shop_id'])
        result['wallet_id'] = str(result['wallet_id'])
        return result
    
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


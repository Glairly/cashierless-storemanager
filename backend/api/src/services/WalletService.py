from typing import List

from ..model.exceptions.AlreadyDeactivatedException import AlreadDeactivatedException
from ..model.exceptions.OutOfBalanceException import OutOfBalanceException
from ..model.Wallet import *
from faker import Faker
from datetime import datetime, timedelta
import random

from pymongo.collection import Collection 
from bson.objectid import ObjectId


class WalletService:

    retry_count = 5

    def __init__(self, mongoClient: Collection):
        self.__mongoClient = mongoClient

    def deduct(self, walletId: str, amount: float):
        result = self.__mongoClient.find_one_and_update({'_id': ObjectId(walletId), 'balance': {"$gt": 0}  }, {'$inc': { 'balance': -1 * amount } })
        if result == None:
            raise OutOfBalanceException("Out of balance")
        return True
    
    def deposit(self, walletId: str, amount: float):
        self.__mongoClient.find_one_and_update({'_id': ObjectId(walletId) }, {'$inc': { 'balance': amount } })
        return True

    def generate_item(self) -> Wallet:
        fake = Faker()
        owner_id = ObjectId()
        balance = fake.random_int(min=10, max=1000, step=1)
        is_belong_to_shop = fake.boolean()
        item = {
            'owner_id': owner_id,
            'balance': balance,
            'is_belong_to_shop': is_belong_to_shop,
        }
        result = self.__mongoClient.insert_one(item)
        return self.__mongoClient.find_one({"_id": result.inserted_id})


    

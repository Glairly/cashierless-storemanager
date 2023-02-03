from ..model.Item import *
from ..model.ItemType import *
from faker import Faker
from datetime import datetime, timedelta
import random

from pymongo.collection import Collection 

class ItemsService:

    def __init__(self, mongoClient: Collection) -> None:
        self.__mongoClient = mongoClient

    def generate_item(self) -> Item:
        fake = Faker()
        name = fake.name()
        price = fake.random_int(min=10, max=100, step=1)
        barCode = fake.uuid4()
        expDate = datetime.now()
        active = fake.boolean()
        type = 1
        item = Item(name=name, price=price, barCode=barCode, expDate=expDate, type=type, active=active)
        self.__mongoClient.insert_one(item.dict())
        return item

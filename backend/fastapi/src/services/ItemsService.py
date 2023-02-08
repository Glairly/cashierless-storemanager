from typing import List
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

    def __init__(self, mongoClient: Collection) -> None:
        self.__mongoClient = mongoClient

    def getItem(self, id: str) -> Item:
        result = self.__mongoClient.find({"_id": ObjectId(id)}).next()
        result['_id'] = str(result['_id'])
        return result

    def getItem_by_name(self, name: str) -> Item:
        result = self.__mongoClient.find({"name": name}).next()
        result['_id'] = str(result['_id'])
        return result

    def getItem_by_barCode(self, barCode: str) -> Item:
        result = self.__mongoClient.find({"barCode": barCode}).next()
        result['_id'] = str(result['_id'])
        return result

    def getItem_by_BBoxes(self, bboxes: List[BBox]) -> List[Item]:
        results = []
        for bbox in bboxes:
            if bbox.type == BBoxType.BarCode:
                key = 'barCode'
            else:
                key = 'name'
            
            try:
                cursor = self.__mongoClient.find({ key : bbox.label })
                result = cursor.next()
                result['_id'] = str(result['_id'])
                results.append(result)
            except:
                pass
        return results

    def generate_item(self) -> Item:
        fake = Faker()
        name = fake.name()
        price = fake.random_int(min=10, max=100, step=1)
        barCode = str(fake.random_int(min=1000000000000, max=9999999999999, step=1))
        expDate = datetime.now()
        active = fake.boolean()
        type = 1
        item = {
            name: name,
            price: price,
            barCode: barCode,
            expDate: expDate,
            type: 1,
            active: True,
        }
        result = self.__mongoClient.insert_one(item)
        return self.__mongoClient.find_one({}, {"_id": result.inserted_id})

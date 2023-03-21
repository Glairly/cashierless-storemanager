from fastapi import HTTPException
from fastapi_sqlalchemy import db
from ..model.models import *

class _ITEMTYPE_CACHE():
    def __init__(self):
        self.cache = None

    def fetch_all(self):
        with db():
            self.cache = db.session.query(ItemType).all()

    def to_dict(self):
        temp = dict()

        if self.cache is None:
            raise HTTPException(status=404, detail="Item Type is not available")

        for item in self.cache:
            temp[item.name] = item.id

        return temp


ITEMTYPE_CACHE = _ITEMTYPE_CACHE()
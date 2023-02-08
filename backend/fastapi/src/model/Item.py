from pydantic import BaseModel
from .ItemType import *
from datetime import datetime

class Item(BaseModel):
    _id: int
    name: str
    price: int
    barCode: str
    expDate: datetime
    type: int
    active: bool

    def __init__(__pydantic_self__, **data) -> None:
        super().__init__(**data)
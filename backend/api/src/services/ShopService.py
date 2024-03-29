from fastapi import HTTPException

from ..model.requests.EditShopRequest import EditShopRequest
from ..model.models import *
from ..model.requests.ShopCreateRequest import ShopCreateRequest

from fastapi_sqlalchemy import db
from sqlalchemy.orm import subqueryload

import re

class ShopService:

    def __is_valid_phone_number(self,phone_number):
        # Remove any whitespace or special characters from the phone number
        phone_number = re.sub(r'\s+|\W+', '', phone_number)
        
        # Validate the phone number format using regular expressions
        pattern = r'^[0-9]{10}$'  # Assumes a 10-digit phone number format
        match = re.match(pattern, phone_number)
        
        if match:
            return True
        else:
            return False

    def get_shop_by_id(self, shop_id: int):
        shop = db.session.query(Shop).filter(Shop.id == shop_id).first()

        if shop is None:
            raise HTTPException('Shop not found')

        return shop
    
    def get_all_shop(self):
        result = db.session.query(Shop.id, Shop.name).all()
        results_dict = []
        for row in result:
            row_dict = {}
            for column, value in row._asdict().items():
                row_dict[column] = value
            results_dict.append(row_dict)
        return results_dict

    def get_shop_by_client_id(self, client_id: int):
        # client = db.session.query(Client).filter(Client.id == client_id).options(subqueryload(C)).first()
        shop = db.session.query(Shop).filter(Shop.owner_id == client_id).options(subqueryload(Shop.wallet)).first()
        
        if shop is None:
            raise HTTPException('Shop not found')
        
        return shop
    
    def create_shop_by_client_id(self, payload: ShopCreateRequest):
        client = db.session.query(Client).filter(Client.id == payload.client_id).first()

        if client is None:
            raise HTTPException(status_code=404, detail="Client not found")
        
        wallet = ShopWallet()
        shop = Shop(name=payload.shop_name, machine_id= payload.machine_id,phone_number = payload.phone_number , wallet=wallet)
        client.shop.append(shop)

        db.session.add(shop)
        db.session.commit()

    def deduct_none_commit(self, shop_id: str, amount: float):
        shop = db.session.query(Shop).filter(Shop.id == shop_id).first()

        if shop is None or shop.wallet is None:
            raise HTTPException(status_code=400, detail="Shop not found")
        if shop.wallet.balance < amount:
            raise HTTPException(status_code=400, detail="Out of Balance")

        
        shop.wallet.balance -= amount
    
    def deposit_none_commit(self, shop_id: str, amount: float):
        shop = db.session.query(Shop).filter(Shop.id == shop_id).first()

        if shop is None or shop.wallet is None:
            raise HTTPException(status_code=400, detail="Shop not found")
        
        shop.wallet.balance += amount

    def edit_shop(self, payload: EditShopRequest):
        if payload.phone_number:
            if not self.__is_valid_phone_number(payload.phone_number):
                raise HTTPException(status_code=400, detail="Invalid Phone Number")
            
        shop = db.session.query(Shop).filter(Shop.id == payload.id).first()

        if not shop:
            raise HTTPException(status_code=400, detail="Shop not found")
        
        if payload.name:
            shop.name = payload.name

        if payload.phone_number:
            shop.phone_number = payload.phone_number

        db.session.commit()
        db.session.refresh(shop)

        return shop.to_dict()
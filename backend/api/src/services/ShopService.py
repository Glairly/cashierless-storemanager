from fastapi import HTTPException
from ..model.models import *
from ..model.requests.ShopCreateRequest import ShopCreateRequest

from fastapi_sqlalchemy import db
from sqlalchemy.orm import subqueryload

class ShopService:

    def get_shop_by_client_id(self, client_id: int):
        # client = db.session.query(Client).filter(Client.id == client_id).options(subqueryload(C)).first()
        shop = db.session.query(Shop).filter(Shop.owner_id == client_id).options(subqueryload(Shop.items)).first()
        return shop
    
    def create_shop_by_client_id(self, payload: ShopCreateRequest):
        client = db.session.query(Client).filter(Client.id == payload.client_id).first()

        if client is None:
            raise HTTPException(status_code=404, detail="Client not found")
        
        wallet = ShopWallet()
        shop = Shop(name=payload.shop_name, machine_id= payload.machine_id, wallet=wallet)
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
from fastapi import HTTPException
from ..model.models import *
from fastapi_sqlalchemy import db

from sqlalchemy.orm import subqueryload

class ClientService:
    def get_client_by_id(self, id: int):
        client = db.session.query(Client).filter(Client.id == id).options(subqueryload(Client.shop)).first()
        return client
    
    def deduct_none_commit(self, client_id: str, amount: float):
        client = db.session.query(Client).filter(Client.id == client_id).first()

        if client is None or client.wallet is None:
            raise HTTPException(status_code=400, detail="Client not found")
        if client.wallet.balance < amount:
            raise HTTPException(status_code=400, detail="Out of Balance")
        
        client.wallet.balance -= amount
        # db.session.commit()
    
    def deposit_none_commit(self, client_id: str, amount: float):
        client = db.session.query(Client).filter(Client.id == client_id).first()

        if client is None or client.wallet is None:
            raise HTTPException(status_code=400, detail="Client not found")
        
        client.wallet.balance += amount
        # db.session.commit()
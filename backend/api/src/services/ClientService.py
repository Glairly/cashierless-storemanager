from fastapi import HTTPException
from ..model.models import *
from fastapi_sqlalchemy import db

from ..model.requests.EditClientRequest import *
from ..libs.Utils import *

from sqlalchemy.orm import subqueryload

import re

class ClientService:
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

    def get_client_by_id(self, id: int):
        client = db.session.query(Client).filter(Client.id == id).options(subqueryload(Client.shop)).options(subqueryload(Client.wallet)).first()
        return client
    
    def edit_client(self, payload: EditClientRequest):
        if payload.phone_number:
            if not self.__is_valid_phone_number(payload.phone_number):
                raise HTTPException(status_code=400, detail="Invalid Phone Number")
            
        client = db.session.query(Client).filter(Client.id == payload.id).first()

        if not client:
            raise HTTPException(status_code=400, detail="Client not found")
        
        if payload.name:
            client.name = payload.name
    
        if payload.gender:
            client.gender = payload.gender

        if payload.phone_number:
            client.phone_number = payload.phone_number

        if payload.profile_image:
            image = base64.b64encode(payload.profile_image)
            client.profile_image: image

        db.session.commit()
        db.session.refresh(client)

        return client.to_dict()
    
    def deduct_none_commit(self, client_id: str, amount: float):
        client = db.session.query(Client).filter(Client.id == client_id).first()

        if client is None or client.wallet is None:
            raise HTTPException(status_code=400, detail="Client not found")
        if client.wallet.balance < amount:
            raise HTTPException(status_code=400, detail="Out of Balance")
        
        client.wallet.balance -= amount
    
    def deposit_none_commit(self, client_id: str, amount: float):
        client = db.session.query(Client).filter(Client.id == client_id).first()

        if client is None or client.wallet is None:
            raise HTTPException(status_code=400, detail="Client not found")
        
        client.wallet.balance += amount
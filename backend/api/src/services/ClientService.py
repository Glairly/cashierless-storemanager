from ..model.models import *
from fastapi_sqlalchemy import db

class ClientService:
    def get_client_by_id(self, id: int) -> Client:
        client = db.session.query(Client).filter(Client.id == id).first()
        return client
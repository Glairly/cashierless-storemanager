from pydantic import BaseModel

class Auth(BaseModel):
    _id: str
    client_id: str
    username: str
    hashed_password: str
    email: str
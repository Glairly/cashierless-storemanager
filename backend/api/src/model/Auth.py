from pydantic import BaseModel

class Auth(BaseModel):
    id: int
    client_id: int
    username: str
    hashed_password: str
    email: str
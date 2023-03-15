from pydantic import BaseModel

class SignUpRequest(BaseModel):
      username: str
      password: str
      email: str
      client_id: int
      name: str
      is_shop_owner: bool
      
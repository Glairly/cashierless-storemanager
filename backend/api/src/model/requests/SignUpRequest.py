from pydantic import BaseModel

class SignUpRequest(BaseModel):
      username: str
      password: str
      email: str
      name: str
      is_shop_owner: bool = False

class SignUpWithShopRequest(BaseModel):
      username: str
      password: str
      email: str
      name: str
      is_shop_owner: bool = True
      shop_name: str
      machine_id: str

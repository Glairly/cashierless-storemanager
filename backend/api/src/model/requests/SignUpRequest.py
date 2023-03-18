from pydantic import BaseModel
import datetime 

class SignUpRequest(BaseModel):
      username: str
      password: str
      email: str
      name: str
      is_shop_owner: bool = False
      gender: str = 'Male'
      birthdate: datetime.time = None
      phone_number: str

class SignUpWithShopRequest(SignUpRequest):
      shop_name: str
      machine_id: int
      shop_phone_number: str
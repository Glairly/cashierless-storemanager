from pydantic import BaseModel

class ShopCreateRequest(BaseModel):
      shop_name: str
      machine_id: int
      client_id: int
      phone_number: str
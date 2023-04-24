from pydantic import BaseModel

class EditShopRequest(BaseModel):
  id: int
  name: str = ""
  phone_number: str = ""

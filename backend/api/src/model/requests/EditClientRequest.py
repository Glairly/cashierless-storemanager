from pydantic import BaseModel

class EditClientRequest(BaseModel):
      id: int
      name: str = ""
      gender: str = ""
    #   birthdate: datetime = None
      phone_number: str = ""

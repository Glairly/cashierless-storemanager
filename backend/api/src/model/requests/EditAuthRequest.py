from pydantic import BaseModel

class EditAuthRequest(BaseModel):
      id: int
      username: str
      password: str = ""
      confirm_password: str = ""
      email: str = ""
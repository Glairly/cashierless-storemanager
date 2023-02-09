from typing import Any
from pydantic import BaseModel

class BaseResult(BaseModel):
    status: bool
    message: str = "Undefined"
    response: Any


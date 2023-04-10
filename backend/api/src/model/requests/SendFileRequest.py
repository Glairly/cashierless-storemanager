from pydantic import BaseModel

class SendFileRequest(BaseModel):
    file: str
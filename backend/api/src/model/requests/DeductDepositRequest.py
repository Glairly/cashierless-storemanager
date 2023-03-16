from .BaseRequest import *

class DeductDepositRequest(BaseRequest):
    target_id: int
    amount: int
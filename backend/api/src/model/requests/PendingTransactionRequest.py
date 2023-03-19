from pydantic import BaseModel

class PendingTransactionRequest(BaseModel):
    payeeId: str
    payeeAccountNumber: str
    payerId: str
    payerAccountNumber: str
    amount: float
    transactionId: str
    transactionDateandTime: str
    currencyCode: str = "TH"
    status: str
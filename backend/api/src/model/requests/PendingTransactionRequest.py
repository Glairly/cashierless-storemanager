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

class PendingTopupTransactionRequest(BaseModel):
    client_id: str
    cashierless_account_number: str
    amount: float
    transactionId: str
    transactionDateandTime: str
    currencyCode: str = "TH"
    status: str
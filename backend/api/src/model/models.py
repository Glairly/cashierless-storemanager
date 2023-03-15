from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import uuid

Base = declarative_base()

# class Auth(Base):
#     __tablename__ = "auths"

#     id= Column(String, primary_key=True, index=True, default=str(uuid.uuid4()))
#     username= Column(String, unique=True, index=True)
#     hashed_password= Column(String, unique=True, index=True)
#     email= Column(String, unique=True, index=True)
#     client_id= Column(String, ForeignKey('clients.id'))

#     client = relationship("Client", foreign_keys=[client_id])

# class Client(Base):
#     __tablename__ = "clients"

#     id= Column(String, primary_key=True, index=True, default=str(uuid.uuid4()))
#     # wallet_id= Column(Integer, ForeignKey("client_wallets.id"))
#     # shop_id= Column(Integer, ForeignKey("shops.id"), nullable=True)
#     auth_id= Column(String, ForeignKey("auths.id"))
#     name= Column(String)
#     is_shop_owner= Column(Boolean)
#     # face_id= Column(Integer)

#     # wallet = relationship("ClientWallet",foreign_keys=[wallet_id])
#     # shop = relationship("Shop", foreign_keys=[shop_id])
#     auth = relationship("Auth", foreign_keys=[auth_id], primaryjoin="Auth.client_id == Client.id")

class Auth(Base):
    __tablename__ = "auths"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), unique=True, index=True)

    client = relationship("Client", back_populates='auth')

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String)
    is_shop_owner = Column(Boolean)
    auth = relationship("Auth", back_populates='client', primaryjoin="Auth.client_id == Client.id")

# class Barcode(Base):
#     __tablename__ = "barcodes"

#     id= Column(Integer, primary_key=True, index=True)
#     item_id= Column(Integer, ForeignKey("items.id"))
#     barcode= Column(Integer)
#     active= Column(Boolean)


# class Item(Base):
#     __tablename__ = "items"

#     id= Column(Integer, primary_key=True, index=True)
#     shop_id= Column(Integer, ForeignKey("shops.id"))
#     quantity= Column(Integer)
#     name= Column(String)
#     price= Column(Float)
#     type= Column(Integer)

#     shop = relationship("Shop", foreign_keys=[shop_id])

# class Shop(Base):
#     __tablename__ = "shops"

#     id= Column(Integer, primary_key=True, index=True)
#     wallet_id= Column(Integer, ForeignKey("shop_wallets.id"))
#     owner_id= Column(Integer, ForeignKey("clients.id"))
#     name= Column(String)
#     machine_id= Column(Integer, unique=True, index=True)

#     wallet = relationship("ShopWallet", foreign_keys=[wallet_id])
#     client = relationship("Client", foreign_keys=[owner_id])
#     items = relationship("Item", back_populates="shop")

# class Transaction(Base):
#     __tablename__ = "transactions"

#     id= Column(Integer, primary_key=True, index=True)
#     client_id= Column(Integer, ForeignKey("clients.id"))
#     shop_id= Column(Integer, ForeignKey("shops.id"))

#     transaction_items = relationship("TransactionItem", back_populates="transaction")

# class TransactionItem(Base):
#     __tablename__ = "transaction_items"

#     id= Column(Integer, primary_key=True, index=True)
#     item_id= Column(Integer, ForeignKey('items.id'))
#     quantity= Column(Integer)
#     total_price= Column(Float)
#     is_barcode= Column(Boolean)

#     transaction = relationship("Transaction", back_populates="transaction_items")

# class ClientWallet(Base):
#     __tablename__ = "client_wallets"

#     id= Column(Integer, primary_key=True, index=True)
#     owner_id= Column(Integer, ForeignKey("clients.id"))
#     balance= Column(Float)

#     owner = relationship("Client", foreign_keys=[owner_id])

# class ShopWallet(Base):
#     __tablename__ = "shop_wallets"

#     id= Column(Integer, primary_key=True, index=True)
#     owner_id= Column(Integer, ForeignKey("shops.id"))
#     balance= Column(Float)

#     owner = relationship("Shop", foreign_keys=[owner_id])
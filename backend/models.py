from sqlalchemy import Column, Integer, String, Boolean, Float
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Auth(Base):
    __tablename__ = "auths"
    __allow_unmapped__ = True

    id= Column(Integer, primary_key=True, index=True)
    client_id= Column(Integer, unique=True, index=True)
    username= Column(String, unique=True, index=True)
    hashed_password= Column(String, unique=True, index=True)
    email= Column(String, unique=True, index=True)

class Barcode(Base):
    __tablename__ = "barcodes"
    __allow_unmapped__ = True

    id= Column(Integer, primary_key=True, index=True)
    item_id= Column(Integer,  unique=True, index=True)
    barcode= Column(Integer, unique=True, index=True)
    active= Column(Boolean)

class Client(Base):
    __tablename__ = "clients"
    __allow_unmapped__ = True

    id= Column(Integer, primary_key=True, index=True)
    wallet_id= Column(Integer, unique=True, index=True)
    shop_id= Column(Integer, unique=True, index=True)
    name= Column(String)
    face_id= Column(Integer)
    is_shop_owner= Column(Boolean)

class Item(Base):
    __tablename__ = "items"
    __allow_unmapped__ = True

    id= Column(Integer, primary_key=True, index=True)
    shop_id= Column(Integer, unique=True, index=True)
    quantity= Column(Integer)
    name= Column(String)
    price= Column(Float)
    type= Column(Integer)

class Shop(Base):
    __tablename__ = "shops"
    __allow_unmapped__ = True

    id= Column(Integer, primary_key=True, index=True)
    wallet_id= Column(Integer, unique=True, index=True)
    owner_id= Column(Integer, unique=True, index=True)
    stock_id= Column(Integer, unique=True, index=True)
    name= Column(String)
    machine_id= Column(Integer, unique=True, index=True)

class Stock(Base):
    __tablename__ = "stocks"
    __allow_unmapped__ = True

    id= Column(Integer, primary_key=True, index=True)
    shop_id= Column(Integer, unique=True, index=True)
    item_id= Column(Integer, unique=True, index=True)
    quantity= Column(Integer)
    active= Column(Boolean)

class Transaction(Base):
    __tablename__ = "transactions"
    __allow_unmapped__ = True

    id= Column(Integer, primary_key=True, index=True)
    client_id= Column(Integer, unique=True, index=True)
    shop_id= Column(Integer, unique=True, index=True)

class TransactionItem(Base):
    __tablename__ = "transaction_items"
    __allow_unmapped__ = True

    id= Column(Integer, primary_key=True, index=True)
    item_id= Column(Integer, unique=True, index=True)
    quantity= Column(Integer)
    total_price= Column(Float)
    is_barcode= Column(Boolean)

class Wallet(Base):
    __tablename__ = "wallets"
    __allow_unmapped__ = True

    id= Column(Integer, primary_key=True, index=True)
    owner_id= Column(Integer, unique=True, index=True)
    balance= Column(Float)
    is_belong_to_shop= Column(Boolean)

 
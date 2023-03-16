from sqlalchemy import ARRAY, Column, Integer, String, Boolean, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.orm import relationship, ColumnProperty
import uuid

Base = declarative_base()

class Auth(Base):
    __tablename__ = "auths"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), unique=True, index=True)

    client = relationship("Client", back_populates='auth')

    def to_dict(self):
        result = {}
        for prop in self.__mapper__.iterate_properties:
            if isinstance(prop, ColumnProperty):
                result[prop.key] = getattr(self, prop.key)
        return result

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    wallet_id = Column(Integer, ForeignKey("client_wallets.id"))
    name = Column(String)
    is_shop_owner = Column(Boolean, default=False)

    auth = relationship("Auth", back_populates='client', primaryjoin="Auth.client_id == Client.id")
    wallet = relationship("ClientWallet", back_populates='owner' , primaryjoin="ClientWallet.id == Client.wallet_id")

    shop = relationship("Shop", backref='owner', primaryjoin="Shop.owner_id == Client.id", collection_class=list)

    def to_dict(self):
        result = {}
        for prop in self.__mapper__.iterate_properties:
            if isinstance(prop, ColumnProperty):
                result[prop.key] = getattr(self, prop.key)
        return result
    
class Shop(Base):
    __tablename__ = "shops"

    id= Column(Integer, primary_key=True, index=True)
    wallet_id= Column(Integer, ForeignKey("shop_wallets.id"))
    owner_id= Column(Integer, ForeignKey("clients.id"))
    name= Column(String)
    machine_id= Column(Integer, unique=True, index=True)

    wallet = relationship("ShopWallet", back_populates='owner', primaryjoin="ShopWallet.id == Shop.wallet_id")
    # owner = relationship("Client", back_populates='shop')
    items = relationship("Item", backref="shop", primaryjoin="Shop.id == Item.shop_id", collection_class=list)
    def to_dict(self):
        result = {}
        for prop in self.__mapper__.iterate_properties:
            if isinstance(prop, ColumnProperty):
                result[prop.key] = getattr(self, prop.key)
        return result
    
class ClientWallet(Base):
    __tablename__ = "client_wallets"

    id= Column(Integer, primary_key=True, index=True)
    balance= Column(Float, default=0.0)

    owner = relationship("Client", back_populates='wallet')

    def to_dict(self):
        result = {}
        for prop in self.__mapper__.iterate_properties:
            if isinstance(prop, ColumnProperty):
                result[prop.key] = getattr(self, prop.key)
        return result
    
class ShopWallet(Base):
    __tablename__ = "shop_wallets"

    id= Column(Integer, primary_key=True, index=True)
    balance= Column(Float, default=0.0)

    owner = relationship("Shop", back_populates='wallet')

    def to_dict(self):
        result = {}
        for prop in self.__mapper__.iterate_properties:
            if isinstance(prop, ColumnProperty):
                result[prop.key] = getattr(self, prop.key)
        return result
    
class Barcode(Base):
    __tablename__ = "barcodes"

    id= Column(Integer, primary_key=True, index=True)
    item_id= Column(Integer, ForeignKey("items.id"))
    barcode= Column(String)
    active= Column(Boolean, default=True)

    # item = relationship("Item", back_populates='barcodes')


class Item(Base):
    __tablename__ = "items"

    id= Column(Integer, primary_key=True, index=True)
    shop_id= Column(Integer, ForeignKey("shops.id"))
    quantity= Column(Integer)
    name= Column(String)
    price= Column(Float)
    type= Column(Integer)

    barcodes = relationship("Barcode", backref="item", primaryjoin="Item.id == Barcode.item_id", collection_class=list)

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


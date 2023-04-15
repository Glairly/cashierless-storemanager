from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, Time, LargeBinary, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, ColumnProperty
import datetime

Base = declarative_base()

class Auth(Base):
    __tablename__ = "auths"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), unique=True, index=True)
    face_id = Column(Integer, ForeignKey("client_face_ids.id"), unique=True, index=True)

    client = relationship("Client", back_populates='auth')
    # face = relationship("ClientFaceIdentity", back_populates='auth')
    face = relationship("ClientFaceIdentity", backref='auth', primaryjoin="Auth.id == ClientFaceIdentity.auth_id", collection_class=list)

    def to_dict(self):
        result = {}
        for prop in self.__mapper__.iterate_properties:
            if isinstance(prop, ColumnProperty) and prop.key != "hashed_password":
                result[prop.key] = getattr(self, prop.key)
        return result

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    wallet_id = Column(Integer, ForeignKey("client_wallets.id"))
    name = Column(String)
    is_shop_owner = Column(Boolean, default=False)
    phone_number = Column(String, unique=True, index=True)
    gender = Column(String, default="Male")
    birthdate = Column(Time)
    profile_image = Column(String)

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
    phone_number = Column(String, unique=True, index=True)
    join_date = Column(Time, default=datetime.datetime.now)

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

class ShopWallet(Base):
    __tablename__ = "shop_wallets"

    id= Column(Integer, primary_key=True, index=True)
    balance= Column(Float, default=0.0)

    owner = relationship("Shop", back_populates='wallet')

class Barcode(Base):
    __tablename__ = "barcodes"

    id= Column(Integer, primary_key=True, index=True)
    item_id= Column(Integer, ForeignKey("items.id"))
    barcode= Column(String)
    active= Column(Boolean, default=True)

class Item(Base):
    __tablename__ = "items"

    id= Column(Integer, primary_key=True, index=True)
    shop_id= Column(Integer, ForeignKey("shops.id"))
    quantity= Column(Integer)
    name= Column(String)
    price= Column(Float)
    type= Column(Integer, ForeignKey("item_types.id"), default=None, nullable=True)

    barcodes = relationship("Barcode", backref="item", primaryjoin="Item.id == Barcode.item_id", collection_class=list)

    def to_dict(self):
        result = {}
        for prop in self.__mapper__.iterate_properties:
            if isinstance(prop, ColumnProperty):
                result[prop.key] = getattr(self, prop.key)
        return result

class ItemType(Base):
    __tablename__ = "item_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    base_price = Column(Float, default=0.0)

class Transaction(Base):
    __tablename__ = "transactions"

    id= Column(Integer, primary_key=True, index=True)
    client_id= Column(Integer, ForeignKey("clients.id"), nullable=True)
    shop_id= Column(Integer, ForeignKey("shops.id"))
    total_price = Column(Float)
    total_items = Column(Integer)
    date = Column(DateTime, default=datetime.datetime.now)

    transaction_items = relationship("TransactionItem", backref="transaction", primaryjoin="Transaction.id == TransactionItem.transaction_id", collection_class=list)

class TransactionItem(Base):
    __tablename__ = "transaction_items"

    id= Column(Integer, primary_key=True, index=True)
    transaction_id= Column(Integer, ForeignKey("transactions.id"))
    item_id= Column(Integer)
    quantity= Column(Integer)
    is_barcode= Column(Boolean, default=False)

class PendingTransaction(Base):
    __tablename__ = "pending_transactions"

    id= Column(Integer, primary_key=True, index=True)
    payee_id= Column(String)
    payee_account_number= Column(String)
    amount= Column(Float)
    date= Column(Time, default=datetime.datetime.now())
    currency_code= Column(String, default="TH")
    status= Column(String, default="Pending")

class TopupTransaction(Base):
    __tablename__ = "topup_transactions"

    id= Column(Integer, primary_key=True, index=True)
    client_id= Column(Integer)
    cashierless_account_number= Column(String, default="0909079790")
    amount= Column(Float)
    date= Column(Time, default=datetime.datetime.now())
    currency_code= Column(String, default="TH")
    status= Column(String, default="Pending")

class ClientFaceIdentity(Base):
    __tablename__ = 'client_face_ids'

    id= Column(Integer, primary_key=True, index=True)
    auth_id= Column(Integer, ForeignKey("auths.id"))
    face_encoded = Column(LargeBinary)

    # auth = relationship("Auth", back_populates='face', primaryjoin="Auth.face_id == ClientFaceIdentity.id")
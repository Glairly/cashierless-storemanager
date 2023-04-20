from sqlalchemy import and_
from fastapi import Depends, HTTPException
from fastapi_sqlalchemy import db
from ..model.requests.SignUpRequest import SignUpRequest, SignUpWithShopRequest

from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext
from datetime import datetime, timedelta

from ..model.models import *
from ..model.requests.EditAuthRequest import EditAuthRequest

from ..services.FaceRecognitionService import *

import jwt
import re

class AuthService:
    def __init__(self, faceRecognitionService: FaceRecognitionService):
        self.__faceRecognitionService = faceRecognitionService

        self.__pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        # JWT config    
        self.__SECRET_KEY = "glairly"
        self.__ALGORITHM = "HS256"
         # 1 hour
        self.__ACCESS_TOKEN_EXPIRE_MINUTES = 60 
    
    def __authenticate_user(self, username: str, password: str) -> Auth:
        auth = db.session.query(Auth).filter(Auth.username == username).first()

        if not auth:
            raise HTTPException(status_code=401, detail="Incorrect username or password")

        if not self.__pwd_context.verify(password, auth.hashed_password):
            raise HTTPException(status_code=401, detail="Incorrect username or password")
        
        return auth
    
    def __create_access_token(self, data: dict) -> str:
        to_encode = data.copy()
        expire = datetime.datetime.utcnow() + timedelta(minutes=self.__ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire, "sub": data["username"]})
        encoded_jwt = jwt.encode(to_encode, self.__SECRET_KEY, algorithm=self.__ALGORITHM)
        return encoded_jwt


    def login(self, form_data: OAuth2PasswordRequestForm = Depends()):
        auth = self.__authenticate_user(form_data.username, form_data.password)
        access_token = self.__create_access_token(auth.to_dict())
        return {"access_token": access_token, "auth": auth.to_dict() , "user": auth.client.to_dict() if auth.client else None}
    

    def __is_valid_password(self, password: str) -> bool:
        '''
        The password must be at least 8 characters long
        The password must contain at least one uppercase letter
        The password must contain at least one lowercase letter
        The password must contain at least one digit
        '''

        # Check if password is at least 8 characters long
        if len(password) < 8:
            return False
        
        # Check if password contains at least one uppercase letter
        if not any(char.isupper() for char in password):
            return False
        
        # Check if password contains at least one lowercase letter
        if not any(char.islower() for char in password):
            return False
        
        # Check if password contains at least one digit
        if not any(char.isdigit() for char in password):
            return False
        
        # Password meets all criteria
        return True
    
    def __is_valid_phone_number(self,phone_number):
        # Remove any whitespace or special characters from the phone number
        phone_number = re.sub(r'\s+|\W+', '', phone_number)
        
        # Validate the phone number format using regular expressions
        pattern = r'^[0-9]{10}$'  # Assumes a 10-digit phone number format
        match = re.match(pattern, phone_number)
        if match:
            return True
        else:
            return False

    def create_user(self, signupRequest: SignUpRequest):
        if db.session.query(Auth).filter(Auth.username == signupRequest.username).first():
            raise HTTPException(status_code=400, detail="Username already exists")        
        
        if not self.__is_valid_password(signupRequest.password):
            raise HTTPException(status_code=400, detail="Password must contain at least one uppercase letter, one lowercase letter, one digit")

        if not self.__is_valid_phone_number(signupRequest.phone_number):
            raise HTTPException(status_code=400, detail="Phone number is not valid")
        
        hashed_password = self.__pwd_context.hash(signupRequest.password)
 
        wallet = ClientWallet()
        client = Client(phone_number=signupRequest.phone_number, gender=signupRequest.gender, birthdate=signupRequest.birthdate, name=signupRequest.name, is_shop_owner=signupRequest.is_shop_owner, wallet=wallet, profile_image=signupRequest.profile_img)
        auth = Auth(username=signupRequest.username, email=signupRequest.email, hashed_password=hashed_password, client=client)
        wallet.auth_id = auth

        if signupRequest.face_img is not None:
            face_id = self.__faceRecognitionService.create_face_id_none_commit(signupRequest.face_img)
            face_id.auth = auth
            db.session.add(face_id)

        db.session.add_all([auth, client, wallet])
        db.session.commit()
        return Auth(username=signupRequest.username, email=signupRequest.email, hashed_password="$secret", client_id=auth.client.id)
    
    def create_user_with_shop(self, signupRequest: SignUpWithShopRequest):
        if db.session.query(Auth).filter(Auth.username == signupRequest.username).first():
            raise HTTPException(status_code=400, detail="Username already exists")        
    
        if not self.__is_valid_password(signupRequest.password):
            raise HTTPException(status_code=400, detail="Password must contain at least one uppercase letter, one lowercase letter, one digit")

        if not self.__is_valid_phone_number(signupRequest.phone_number):
            raise HTTPException(status_code=400, detail="Phone number is not valid")

        if not self.__is_valid_phone_number(signupRequest.shop_phone_number):
            raise HTTPException(status_code=400, detail="Shop Phone number is not valid")

        hashed_password = self.__pwd_context.hash(signupRequest.password)

        wallet = ClientWallet()
        client = Client(phone_number=signupRequest.phone_number, gender=signupRequest.gender, birthdate=signupRequest.birthdate, name=signupRequest.name, is_shop_owner=signupRequest.is_shop_owner, wallet=wallet, profile_image=signupRequest.profile_img)
        auth = Auth(username=signupRequest.username, email=signupRequest.email, hashed_password=hashed_password, client=client)
        
        shop_wallet = ShopWallet()
        
        if signupRequest.face_img is not None:
            face_id = self.__faceRecognitionService.create_face_id_none_commit(signupRequest.face_img)
            face_id.auth = auth
            db.session.add(face_id)

        db.session.add_all([shop_wallet, auth, client, wallet])
        db.session.commit()
        shop = Shop(phone_number=signupRequest.shop_phone_number, name= signupRequest.name, wallet=shop_wallet, owner_id=client.id)
        db.session.add(shop)
        db.session.commit()
        return Auth(username=signupRequest.username, email=signupRequest.email, hashed_password="$secret", client_id=auth.client.id)
    
    def edit_user(self, payload: EditAuthRequest):
        if payload.password:
            if  not payload.password == payload.confirm_password:
                raise HTTPException(status_code=400, detail="Passwords do not match")
            
            if not self.__is_valid_password(payload.password):
                raise HTTPException(status_code=400, detail="Password must contain at least one uppercase letter, one lowercase letter, one digit")
        
        auth = db.session.query(Auth).filter(and_(Auth.username == payload.username, Auth.id == payload.id)).first()
        
        hashed_password = self.__pwd_context.hash(payload.password)
        
        if payload.password:
            auth.hashed_password = hashed_password

        if payload.email:
            auth.email = payload.email

        db.session.commit()
        db.session.refresh(auth)

        return auth.to_dict()

    def recognize_face(self, file: bytes):
        auth = self.__faceRecognitionService.find_face_id(file)
        access_token = self.__create_access_token(auth.to_dict())
        wallet = db.session.query(ClientWallet).filter(ClientWallet.id == auth.client.wallet_id).first()
        return {"access_token": access_token, "token_type": "bearer", "user": auth.client.to_dict() if auth.client else None, "wallet": wallet}
    
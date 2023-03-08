from typing import List

from fastapi import Depends, HTTPException
from pydantic import ValidationError

from ..model.exceptions.AlreadyDeactivatedException import AlreadDeactivatedException
from ..model.Client import *
from ..model.Auth import *

from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext
from pymongo.collection import Collection 
from bson.objectid import ObjectId
from datetime import datetime, timedelta

import jwt


class AuthService:
    def __init__(self, authClient: Collection):
        self.__authClient = authClient
        self.__pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

        # JWT config    
        self.__SECRET_KEY = "glairly"
        self.__ALGORITHM = "HS256"
         # 1 hour
        self.__ACCESS_TOKEN_EXPIRE_MINUTES = 60 
    
    def __authenticate_user(self, username: str, password: str) -> Auth:
        user = self.__authClient.find_one({"username": username})
        if not user:
            raise HTTPException(status_code=401, detail="Incorrect username or password")
            
        auth = Auth(_id=str(user["_id"]), client_id=user['client_id'] , username=user["username"], email=user["email"], hashed_password=user["password"])

        if not self.__pwd_context.verify(password, auth.hashed_password):
            raise HTTPException(status_code=401, detail="Incorrect username or password")
        
        return auth
    
    def __create_access_token(self, data: dict) -> str:
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=self.__ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire, "sub": data["username"]})
        encoded_jwt = jwt.encode(to_encode, self.__SECRET_KEY, algorithm=self.__ALGORITHM)
        return encoded_jwt


    def login(self, form_data: OAuth2PasswordRequestForm = Depends()):
        auth = self.__authenticate_user(form_data.username, form_data.password)
        access_token = self.__create_access_token(dict(auth))
        return {"access_token": access_token, "token_type": "bearer"}
    

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

    def create_user(self, username: str, email: str, password: str, client_id: str=None):
        
        if self.__authClient.find_one({"username": username}):
            raise HTTPException(status_code=400, detail="Username already exists")        
        
        if self.__authClient.find_one({"client_id": client_id}):
            raise HTTPException(status_code=400, detail="Client already have a Authorization account")   

        if not self.__is_valid_password(password):
            raise HTTPException(status_code=400, detail="Password must contain at least one uppercase letter, one lowercase letter, one digit")


        hashed_password = self.__pwd_context.hash(password)
        self.__authClient.insert_one({"username": username, "email": email, "password": hashed_password, "client_id": client_id}).inserted_id
        return Auth(_id="$secret", username=username, email=email, hashed_password="$secret", client_id=client_id)
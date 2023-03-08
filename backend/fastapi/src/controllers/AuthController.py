from fastapi import APIRouter, Depends

# Libs
from ..libs.Utils import Utils

# Services
from ..services.AuthService import *

# Result
from ..model.results.DetectionResult import *
from ..model.results.DecodeResult import *

from ..model.Item import *
from fastapi.security import OAuth2PasswordRequestForm

class AuthController:
    router = APIRouter(prefix="/capi/v1")

    def __init__(self, authService: AuthService):
        self.__authService = authService

        self.router.add_api_route("/signin", self.signin, methods=["POST"])
        self.router.add_api_route("/login", self.login, methods=["POST"])
    

    def login(self, form_data: OAuth2PasswordRequestForm = Depends()):
        return self.__authService.login(form_data=form_data)


    def signin(self, username: str, email: str, password: str, client_id: str=None):
        return self.__authService.create_user(username=username, email=email, password=password, client_id=client_id)
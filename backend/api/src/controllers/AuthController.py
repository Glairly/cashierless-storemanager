from fastapi import APIRouter, Depends

# Libs
# Services
from ..services.AuthService import *

# Result
from ..model.results.DetectionResult import *
from ..model.results.DecodeResult import *

from fastapi.security import OAuth2PasswordRequestForm

from ..model.requests.SignUpRequest import *

class AuthController:
    router = APIRouter(prefix="/capi/v1")

    def __init__(self, authService: AuthService):
        self.__authService = authService

        self.router.add_api_route("/signin", self.signin, methods=["POST"])
        self.router.add_api_route("/signin_with_shop", self.signin, methods=["POST"])
        self.router.add_api_route("/login", self.login, methods=["POST"])
    

    def login(self, form_data: OAuth2PasswordRequestForm = Depends()):
        return self.__authService.login(form_data=form_data)

    def signin(self, form_data: SignUpRequest):
        return self.__authService.create_user(form_data)

    def signin_with_shop(self, form_data: SignUpWithShopRequest):
        return self.__authService.create_user_with_shop(form_data)
from fastapi import APIRouter, Depends

# Libs
# Services
from ..services.AuthService import *

# Result
from ..model.results.DetectionResult import *
from ..model.results.DecodeResult import *

from fastapi.security import OAuth2PasswordRequestForm

from ..model.requests.SignUpRequest import *
from ..model.requests.SendFileRequest import *
from ..model.requests.EditAuthRequest import *

class AuthController:
    router = APIRouter(prefix="/capi/v1")

    def __init__(self, authService: AuthService):
        self.__authService = authService

        self.router.add_api_route("/signup", self.signup, methods=["POST"])
        self.router.add_api_route("/signup_with_shop", self.signup_with_shop, methods=["POST"])
        self.router.add_api_route("/login", self.login, methods=["POST"])
        self.router.add_api_route("/login_with_face", self.login_with_face, methods=["POST"])
        self.router.add_api_route("/edit_user", self.edit_user, methods=["POST"])

    def login(self, form_data: OAuth2PasswordRequestForm = Depends()):
        return self.__authService.login(form_data=form_data)
    
    def login_with_face(self, payload: SendFileRequest):
        return self.__authService.recognize_face(payload.file)

    def signup(self, form_data: SignUpRequest):
        return self.__authService.create_user(form_data)

    def signup_with_shop(self, form_data: SignUpWithShopRequest):
        return self.__authService.create_user_with_shop(form_data)
    
    def edit_user(self, payload: EditAuthRequest):
        return self.__authService.edit_user(payload)
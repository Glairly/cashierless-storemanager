import { ThunkAction } from "redux-thunk";
import { RootState } from "./store";
import {
  resetAuth,
  setMessage,
  setToken,
  setUser,
  setWallet,
  setAuth,
  setPending,
  setSuccess,
  setFailure,
} from "../features/auth/authSlice";
import { Action } from "redux";

import {
  DefaultApi,
  EditAuthRequest,
  EditClientCapiV1EditClientPostRequest,
  EditClientRequest,
  EditUserCapiV1EditUserPostRequest,
  GetClientByIdCapiV1GetClientByIdGetRequest,
  SignUpRequest
} from "./api";
import { LoginCapiV1LoginPostRequest } from "./api";
import { SignUpRequest, SignupCapiV1SignupPostRequest } from './api';
import { SignUpWithShopRequest, SignupWithShopCapiV1SignupWithShopPostRequest } from "./api";


export const login =
  (
    username: string,
    password: string
  ): ThunkAction<void, RootState, null, Action<string>> =>
  async (dispatch) => {
    try {
      const request = {
        username: username,
        password: password,
      } as LoginCapiV1LoginPostRequest;

      const res = await new DefaultApi().loginCapiV1LoginPost(request);

      const { access_token, user, auth } = res;
      dispatch(setToken(access_token));
      dispatch(setUser(user));
      dispatch(setAuth(auth));
    } catch (error) {}
  };

export const logout =
  (): ThunkAction<void, RootState, null, Action<string>> =>
  async (dispatch) => {
    dispatch(resetAuth());
  };

export const fetchWallet =
  (): ThunkAction<void, RootState, null, Action<string>> =>
  async (dispatch, getState) => {
    try {
      const { auth } = getState();

      if (!auth.user?.id) return false;

      const request = {
        id: auth.user.id,
      } as GetClientByIdCapiV1GetClientByIdGetRequest;

      const meta = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      } as RequestInit;

      const res = await new DefaultApi().getClientByIdCapiV1GetClientByIdGet(
        request,
        meta
      );
      dispatch(setWallet(res.wallet));
    } catch (error) {}
  };

export const editClient =
  (
    fullname: string,
    phone_number: string,
    gender: string
  ): ThunkAction<void, RootState, null, Action<string>> =>
  async (dispatch, getState) => {
    dispatch(setPending());

    try {
      const { auth } = getState();

      if (!auth.user?.id) return false;

      const request = {
        editClientRequest: {
          id: auth.user.id,
          name: fullname,
          phoneNumber: phone_number,
          gender: gender,
        } as EditClientRequest,
      } as EditClientCapiV1EditClientPostRequest;

      const meta = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          accept: "application/json",
          "Content-Type": "application/json",
        },
      } as RequestInit;

      const res = await new DefaultApi().editClientCapiV1EditClientPost(
        request,
        meta
      );
      dispatch(setUser(res));
      dispatch(setSuccess());
    } catch (error) {
      console.log(error);
      dispatch(setFailure("Error has Occured please try again"));
    }
  };

export const editAuth =
  (
    email: string,
    password: string,
    confirmPassword: string
  ): ThunkAction<void, RootState, null, Action<string>> =>
  async (dispatch, getState) => {
    dispatch(setPending());

    try {
      const { auth } = getState();

      if (!auth.auth?.id) return false;

      const request = {
        editAuthRequest: {
          id: auth.auth.id,
          email: email,
          username: auth.auth.username,
          password: password,
          confirmPassword: confirmPassword,
        } as EditAuthRequest,
      } as EditUserCapiV1EditUserPostRequest;

      const meta = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          accept: "application/json",
          "Content-Type": "application/json",
        },
      } as RequestInit;

      const res = await new DefaultApi().editUserCapiV1EditUserPost(
        request,
        meta
      );
      dispatch(setAuth(res));
      dispatch(setSuccess());
    } catch (error) {
      console.log(error);
      dispatch(setFailure("Error has Occured please try again"));
    }
  };
export const register = (values: any): ThunkAction<void, RootState, null, Action<string>> => async dispatch => {
  try {
    const request = {
      signUpRequest: {
        username: values.username,
        password: values.password,
        email: values.email,
        name: values.name,
        isShopOwner: values.is_shop_owner,
        gender: values.gender,
        birthdate: values.birth_date + "T00:00:00",
        phoneNumber: values.phone_number,
        faceImg: values.face_img == '' ? null : values.face_img
      } as SignUpRequest
    } as SignupCapiV1SignupPostRequest;

    const res = await (new DefaultApi()).signupCapiV1SignupPost(request)
      .catch(error => {
        error.response.json().then((errorBody:any) => {
          dispatch(setMessage(errorBody.detail));
        })
      });
    dispatch(setMessage("Register Success! Please Login."));
  } catch (error) {
    console.log(error);
  }
};

export const registerShop = (values: any): ThunkAction<void, RootState, null, Action<string>> => async dispatch => {
  try {
    const request = {
      signUpWithShopRequest: {
        username: values.username,
        password: values.password,
        email: values.email,
        name: values.name,
        isShopOwner: values.is_shop_owner,
        gender: values.gender,
        birthdate: values.birth_date + "T00:00:00",
        phoneNumber: values.phone_number,
        faceImg: values.face_img == '' ? null : values.face_img,
        shopName: values.shop_name,
        machineId: values.machine_id,
        shopPhoneNumber: values.shop_phone_number
      } as SignUpWithShopRequest
    } as SignupWithShopCapiV1SignupWithShopPostRequest;

    const res = await (new DefaultApi()).signupWithShopCapiV1SignupWithShopPost(request)
      .catch(error => {
        error.response.json().then((errorBody:any) => {
          dispatch(setMessage(errorBody.detail));
        })
      });
    dispatch(setMessage("Register Success! Please login."));
  } catch (error) {
    console.log(error);
  }
};
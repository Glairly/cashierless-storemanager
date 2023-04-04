import { ThunkAction } from "redux-thunk";
import { RootState } from "./store";
import {
  resetAuth,
  setMessage,
  setToken,
  setUser,
  setWallet,
} from "../features/auth/authSlice";
import { Action } from "redux";

import { DefaultApi, GetClientByIdCapiV1GetClientByIdGetRequest, SignUpRequest } from "./api";
import { LoginCapiV1LoginPostRequest } from "./api";
import { SignupCapiV1SignupPostRequest } from './api';

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

      const { access_token, user  } = res;
      dispatch(setToken(access_token));
      dispatch(setUser(user));;
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
      .then(data => {
        dispatch(setMessage("Register Success! Please login."));
      })
      .catch(error => {
        error.response.json().then((errorBody:any) => {
          dispatch(setMessage(errorBody.detail));
        })
      });
  } catch (error) {
    console.log(error);
  }
};

import { ThunkAction } from "redux-thunk";
import { RootState } from "./store";
import {
  resetAuth,
  setToken,
  setUser,
  setWallet,
  setAuth
} from "../features/auth/authSlice";
import { Action } from "redux";

import { DefaultApi, GetClientByIdCapiV1GetClientByIdGetRequest } from "./api";
import { LoginCapiV1LoginPostRequest } from "./api";

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
      dispatch(setAuth(auth))
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

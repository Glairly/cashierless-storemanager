import { ThunkAction } from 'redux-thunk';
import { RootState } from './store';
import { setToken, setUser } from '../features/auth/authSlice';
import { Action } from 'redux';

import { DefaultApi } from './api';
import { LoginCapiV1LoginPostRequest } from './api';
import { SignupCapiV1SignupPostRequest } from './api';

export const login = (username: string, password: string): ThunkAction<void, RootState, null, Action<string>> => async dispatch => {
  try {

    const request = {
      username: username,
      password: password,
    } as LoginCapiV1LoginPostRequest;
    
    const res = await (new DefaultApi()).loginCapiV1LoginPost(request)

    const { access_token, user} = res;
    dispatch(setToken(access_token));
    dispatch(setUser(user))
  } catch (error) {
    console.error(error);
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
        birthdate: values.birth_date,
        phoneNumber: values.phone_number,
        faceImg: values.face_img
      }
    } as SignupCapiV1SignupPostRequest;

    const res = await (new DefaultApi()).signupCapiV1SignupPost(request)
  } catch (error) {
    console.error(error);
  }
};

import { ThunkAction } from "redux-thunk";
import { RootState } from "../../app/store";
import { Action } from "redux";
import {
  setItem,
  setItemType
} from "./supplySlice";
import {
  DefaultApi
} from "../../app/api";

export const getAllItemType =
  (): ThunkAction<void, RootState, null, Action<string>> =>
    async (dispatch, getState) => { 
      try {
        const { auth } = getState();

        const res = await new DefaultApi().getAllItemTypeSmapiV1GetAllItemTypeGet();
        dispatch(setItemType(res));
      } catch (error) { }
    }

export const getItemByShopId = 
  (): ThunkAction<void, RootState, null, Action<string>> =>
    async (dispatch, getState) => { 
      try {
        const { auth } = getState();
        if (!auth.shop?.id) return false;
        const request = {
          shopId: auth.shop.id
        }
        const res = await new DefaultApi().getItemByShopIdSmapiV1GetItemByShopIdGet(request);
        // dispatch(setItem(res));
        return res;
      } catch (error) { }
    }
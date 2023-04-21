import { ThunkAction } from "redux-thunk";
import { RootState } from "../../app/store";
import { Action } from "redux";
import {
  setItem,
  setItemType
} from "./supplySlice";
import {
  AddItemRequest,
  DefaultApi, EditItemRequest, EditItemSmapiV1EditItemPostRequest, ItemRequest
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

export const editItem = 
  (items: ItemRequest[]): ThunkAction<void, RootState, null, Action<string>> =>
    async (dispatch, getState) => { 
      try {
        const { auth } = getState();
        if (!auth.shop?.id) return false;
        const request = {
          editItemRequest: {
            shopId: auth.shop.id,
            items: items
          } as EditItemRequest
        } as EditItemSmapiV1EditItemPostRequest;
        const meta = {
        headers: {
          // Authorization: `Bearer ${auth.token}`,
          accept: "application/json",
          "Content-Type": "application/json",
        },
      } as RequestInit;
        const res = await new DefaultApi().editItemSmapiV1EditItemPost(request, meta);
        return res;
      } catch (error) { }
    }
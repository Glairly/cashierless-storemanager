import { ThunkAction } from "redux-thunk";
import { RootState } from "../../app/store";
import { Action } from "redux";
import {
  setItemType
} from "./supplySlice";
import {
  DefaultApi
} from "../../app/api";

export const getAllItemType =
  (): ThunkAction<void, RootState, null, Action<string>> =>
    async () => { 
      try {
        const res = await new DefaultApi().getAllItemTypeSmapiV1GetAllItemTypeGet();
        return res
      } catch (error) { }
    }
import { ThunkAction } from "redux-thunk";
import { RootState } from "../../app/store";
import { Action } from "redux";

import {
  DefaultApi,
  GetClientTransactionsFapiV1GetClientTransactionsGetRequest,
  TopupFapiV1TopupPostRequest,
  TransactionTopupRequest,
} from "../../app/api";
import { setClientTransaction } from "./transactionSlice";

export const fetchClientTransaction =
  (): ThunkAction<void, RootState, null, Action<string>> =>
  async (dispatch, getState) => {
    try {
      const { auth } = getState();

      if (!auth.user?.id) return false;

      const request = {
        clientId: auth.user.id,
      } as GetClientTransactionsFapiV1GetClientTransactionsGetRequest;

      const meta = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      } as RequestInit;

      const res =
        await new DefaultApi().getClientTransactionsFapiV1GetClientTransactionsGet(
          request,
          meta
        );

      dispatch(setClientTransaction(res));
    } catch (error) {}
  };

export const topup = 
  (totalTopup: number): ThunkAction<void, RootState, null, Action<string>> => 
    async (dispatch, getState) => {
    try {
      const { auth } = getState();

      if (!auth.user?.id) return false;
      const request = {
        transactionTopupRequest: {
          clientId: auth.user.id,
          totalTopup: totalTopup
        } as TransactionTopupRequest
      } as TopupFapiV1TopupPostRequest

      const meta = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          accept: "application/json",
          "Content-Type": "application/json",
        },
      } as RequestInit;

      const res = await new DefaultApi().topupFapiV1TopupPost(
        request,
        meta
      );
    } catch (error) {
      
    }
  }
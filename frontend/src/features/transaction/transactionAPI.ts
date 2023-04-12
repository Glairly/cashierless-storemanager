import { ThunkAction } from "redux-thunk";
import { RootState } from "../../app/store";
import { Action } from "redux";

import {
  AnonymousTransactionRequest,
  DefaultApi,
  DoAnonymousTransactionFapiV1DoAnonymousTransactionPostRequest,
  DoTransactionFapiV1DoTransactionPostRequest,
  GetClientTransactionsFapiV1GetClientTransactionsGetRequest,
  TransactionItemRequest,
  TransactionRequest,
} from "../../app/api";
import {
  setClientTransaction,
  setFailure,
  setPending,
  setSuccess,
} from "./transactionSlice";

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

export const DoTransaction =
  (
    items: TransactionItemRequest[],
    barcodes: string[]
  ): ThunkAction<void, RootState, null, Action<string>> =>
  async (dispatch, getState) => {
    dispatch(setPending());
    try {
      const { inference } = getState();
      const { customerInfo } = inference;
      if (!customerInfo?.user?.id) return;

      const request = {
        transactionRequest: {
          shopId: inference.shop_id,
          items: items,
          barcodes: barcodes,
          clientId: customerInfo.user.id,
        } as TransactionRequest,
      } as DoTransactionFapiV1DoTransactionPostRequest;

      const meta = {
        headers: {
          Authorization: `Bearer ${customerInfo.access_token}`,
        },
      } as RequestInit;

      const res = await new DefaultApi().doTransactionFapiV1DoTransactionPost(
        request,
        meta
      );

      dispatch(setSuccess());
    } catch (error) {
      dispatch(setFailure("Error has occurred"));
    }
  };

export const DoAnonyTransaction =
  (
    items: TransactionItemRequest[],
    barcodes: string[]
  ): ThunkAction<void, RootState, null, Action<string>> =>
  async (dispatch, getState) => {
    dispatch(setPending());
    try {
      const { inference } = getState();
      const { customerInfo } = inference;
      if (!customerInfo?.user?.id) return;

      const request = {
        anonymousTransactionRequest: {
          shopId: inference.shop_id,
          items: items,
          barcodes: barcodes,
        } as AnonymousTransactionRequest,
      } as DoAnonymousTransactionFapiV1DoAnonymousTransactionPostRequest;

      const meta = {
        headers: {
          Authorization: `Bearer ${customerInfo.access_token}`,
        },
      } as RequestInit;

      const res =
        await new DefaultApi().doAnonymousTransactionFapiV1DoAnonymousTransactionPost(
          request,
          meta
        );

      dispatch(setSuccess());
    } catch (error) {
      dispatch(setFailure("Error has occurred"));
    }
  };

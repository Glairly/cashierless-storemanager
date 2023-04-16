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
  TopupFapiV1TopupPostRequest,
  TransactionTopupRequest,
  DoTransactionWithWalletFapiV1DoTransactionWithWalletPostRequest,
  WalletTransactionRequest
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

export const DoTransactionWithWallet =
  (
    items: TransactionItemRequest[],
    barcodes: string[],
    walletId: number
  ): ThunkAction<void, RootState, null, Action<string>> =>
  async (dispatch, getState) => {
    dispatch(setPending());
    try {
      const { inference } = getState();
      const { customerInfo } = inference;
      if (!customerInfo?.user?.id) return;

      const request = {
        walletTransactionRequest: {
          shopId: inference.shop_id,
          items: items,
          barcodes: barcodes,
          clientId: customerInfo.user.id,
          transactionId: walletId
        } as WalletTransactionRequest,
      } as DoTransactionWithWalletFapiV1DoTransactionWithWalletPostRequest;

      const meta = {
        headers: {
          Authorization: `Bearer ${customerInfo.access_token}`,
          accept: "application/json",
          "Content-Type": "application/json",
        },
      } as RequestInit;

      const res = await new DefaultApi().doTransactionWithWalletFapiV1DoTransactionWithWalletPost(
        request,
        meta
      );

      dispatch(setSuccess());
    } catch (error) {
      dispatch(setFailure("Error has occurred"));
    }
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
          accept: "application/json",
          "Content-Type": "application/json",
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

      const request = {
        anonymousTransactionRequest: {
          shopId: inference.shop_id,
          items: items,
          barcodes: barcodes,
        } as AnonymousTransactionRequest,
      } as DoAnonymousTransactionFapiV1DoAnonymousTransactionPostRequest;

      const meta = {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
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

export const topup = 
  (totalTopup: number): ThunkAction<void, RootState, null, Action<string>> => 
    async (_dispatch, getState) => {
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
  
export const getAllShop =
  (): ThunkAction<void, RootState, null, Action<string>> =>
    async () => { 
      try {
        const res = await new DefaultApi().getAllShopCapiV1GetAllShopGet();
        return res
      } catch (error) { }
    }
import { ThunkAction } from "redux-thunk";
import { RootState } from "../../app/store";
import { Action } from "redux";

import {
  DefaultApi,
  GetClientTransactionsFapiV1GetClientTransactionsGetRequest,
  InferenceImapiV1InferencePostRequest,
  InferenceRequest,
} from "../../app/api";
import { setInferenceResult } from "./inferenceSlice";
// import { setClientTransaction } from "./transactionSlice";

export const checkingout =
  (imgSrc: string): ThunkAction<void, RootState, null, Action<string>> =>
  async (dispatch, getState) => {
    try {
      const { inference } = getState();

      if (!inference?.shop_id) return false;

      const request = {
        inferenceRequest: {
          shopId: inference.shop_id,
          shouldDetectBarcode: inference.is_barcode_enabled,
          file: imgSrc,
        } as InferenceRequest,
      } as InferenceImapiV1InferencePostRequest;

      const meta = {
        headers: {
          // Authorization: `Bearer ${auth.token}`,
          accept: "application/json",
          "Content-Type": "application/json",
        },
      } as RequestInit;

      const res = await new DefaultApi().inferenceImapiV1InferencePost(
        request,
        meta
      );

      dispatch(setInferenceResult(res));
    } catch (error) {}
  };

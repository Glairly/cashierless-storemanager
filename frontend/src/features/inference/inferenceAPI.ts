import { ThunkAction } from "redux-thunk";
import { RootState } from "../../app/store";
import { Action } from "redux";

import {
  DefaultApi,
  GetClientTransactionsFapiV1GetClientTransactionsGetRequest,
  InferenceImapiV1InferencePostRequest,
  InferenceRequest,
  LoginWithFaceCapiV1LoginWithFacePostRequest,
  SendFileRequest,
} from "../../app/api";
import {
  setCustomerInfo,
  setFailure,
  setInferenceResult,
  setPending,
  setSuccess,
} from "./inferenceSlice";
// import { setClientTransaction } from "./transactionSlice";

export const checkingout =
  (imgSrc: string): ThunkAction<void, RootState, null, Action<string>> =>
  async (dispatch, getState) => {
    dispatch(setPending());

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
      dispatch(setSuccess());
    } catch (error) {
      dispatch(setFailure("Error has occured please try again"));
    }
  };

export const recognizeFace =
  (imgSrc: string): ThunkAction<void, RootState, null, Action<string>> =>
  async (dispatch, getState) => {
    dispatch(setPending());

    try {
      const request = {
        sendFileRequest: {
          file: imgSrc,
        } as SendFileRequest,
      } as LoginWithFaceCapiV1LoginWithFacePostRequest;

      const meta = {
        headers: {
          // Authorization: `Bearer ${auth.token}`,
          accept: "application/json",
          "Content-Type": "application/json",
        },
      } as RequestInit;

      const res = await new DefaultApi().loginWithFaceCapiV1LoginWithFacePost(
        request,
        meta
      );

      dispatch(setCustomerInfo(res));
      dispatch(setSuccess());
    } catch (error) {
      dispatch(setCustomerInfo(null));
      dispatch(setFailure("Error has occured please try again"));
    }
  };

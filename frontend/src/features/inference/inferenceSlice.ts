import { createSlice } from "@reduxjs/toolkit";
import { InferenceResult } from "../../app/api";

export interface Item {
  id: number;
  shop_id: number;
  quantity: number;
  name: string;
  price: number;
  type: number;
}

interface TransactionState {
  inferenceResult: InferenceResult | null;
  shop_id: number | null;
  is_barcode_enabled: boolean;
}

const initialState: TransactionState = {
  inferenceResult: null,
  shop_id: 3,
  is_barcode_enabled: false,
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setInferenceResult(state, action) {
      state.inferenceResult = action.payload;
    },
    setShopId(state, action) {
      state.shop_id = action.payload;
    },
    setBarcodeEnabled(state, action) {
      state.is_barcode_enabled = action.payload;
    },
  },
});

export const { setInferenceResult, setShopId, setBarcodeEnabled } =
  transactionSlice.actions;

export default transactionSlice.reducer;

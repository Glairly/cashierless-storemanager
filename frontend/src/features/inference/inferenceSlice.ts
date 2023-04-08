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
  machine_id: number | null;
}

const initialState: TransactionState = {
  inferenceResult: null,
  shop_id: 3,
  is_barcode_enabled: false,
  machine_id: null,
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
    setMachineId(state, action) {
      state.machine_id = action.payload;
    },
  },
});

export const {
  setInferenceResult,
  setShopId,
  setBarcodeEnabled,
  setMachineId,
} = transactionSlice.actions;

export default transactionSlice.reducer;

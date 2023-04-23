import { createSlice } from "@reduxjs/toolkit";
import { Client, Shop } from "../auth/authSlice";

export interface TransactionItem {
  id: number;
  transaction_id: number;
  item_id: number;
  item_name: string;
  quantity: number;
  is_barcode: boolean;
}

export interface Transaction {
  id: number;
  client_id: number;
  shop_id: number;
  total_price: number;
  total_items: number;
  date: string;
  transaction_items: TransactionItem[];
  client_name: string;
  shop_name: string;
}


interface TransactionState {
  clientTransaction: Transaction[];
  pendingStatus: "idle" | "pending" | "fulfilled" | "rejected";
  isLoading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  clientTransaction: [],
  pendingStatus: "idle",
  isLoading: false,
  error: null
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setClientTransaction(state, action) {
      state.clientTransaction = action.payload;
    },
    setIdle(state) {
      return {
        ...state,
        pendingStatus: "idle",
        isLoading: false,
        error: null,
      };
    },
    setPending(state) {
      return {
        ...state,
        pendingStatus: "pending",
        isLoading: true,
        error: null,
      };
    },
    setSuccess(state) {
      return {
        ...state,
        pendingStatus: "fulfilled",
        isLoading: false,
        error: null,
      };
    },
    setFailure(state, action) {
      return {
        ...state,
        pendingStatus: "rejected",
        isLoading: false,
        error: action.payload,
      };
    },
  },
});

export const {
  setClientTransaction,
  setPending,
  setSuccess,
  setFailure,
  setIdle,
} = transactionSlice.actions;

export default transactionSlice.reducer;

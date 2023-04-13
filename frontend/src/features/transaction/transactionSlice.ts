import { createSlice } from "@reduxjs/toolkit";

export interface TransactionItem {
  id: number;
  transaction_id: number;
  item_id: number;
  quantity: number;
  is_barcode: boolean;
}

export interface Transaction {
  id: number;
  client_id: number;
  shop_id: number;
  total_price: number;
  total_items: number;
  date: Date;
  transaction_items: TransactionItem[];
}


interface TransactionState {
  clientTransaction: Transaction[];
  pendingStatus: "idle" | "pending" | "fulfilled" | "rejected";
  isLoading: boolean;
  error: null;
  topupTransaction: TopupTransaction | null;
}

const initialState: TransactionState = {
  clientTransaction: [],
  pendingStatus: "idle",
  isLoading: false,
  error: null,
  topupTransaction: null,
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setClientTransaction(state, action) {
      state.clientTransaction = action.payload;
    },
    setTopupTransaction(state, action) {
      state.topupTransaction = action.payload;
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
  setClientTransaction, setTopupTransaction,
  setPending,
  setSuccess,
  setFailure,
  setIdle,
} = transactionSlice.actions;

export default transactionSlice.reducer;

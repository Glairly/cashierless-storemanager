import { createSlice } from '@reduxjs/toolkit';

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

export interface TopupTransaction {
  id: number;
  client_id: number;
  topup_price: number;
  date: Date;
}

interface TransactionState {
  clientTransaction: Transaction[];
  topupTransaction: TopupTransaction | null;
}

const initialState: TransactionState = {
  clientTransaction: [],
  topupTransaction: null,
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setClientTransaction(state, action) {
      state.clientTransaction = action.payload;
    },
    setTopupTransaction(state, action) {
      state.topupTransaction = action.payload;
    }
  },
});

export const { setClientTransaction, setTopupTransaction } = transactionSlice.actions;

export default transactionSlice.reducer;
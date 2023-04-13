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


interface TransactionState {
  clientTransaction: Transaction[];}

const initialState: TransactionState = {
  clientTransaction: []
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setClientTransaction(state, action) {
      state.clientTransaction = action.payload;
    }
  },
});

export const { setClientTransaction } = transactionSlice.actions;

export default transactionSlice.reducer;
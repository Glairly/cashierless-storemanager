import { createSlice } from "@reduxjs/toolkit";

interface Client {
  id: number;
  name: string;
  phone_number: string;
  gender: string;
  birthdate: Date;
  is_shop_owner: boolean;
  wallet_id: number;
}

interface ClientWallet {
  id: number;
  balance: number;
}

interface AuthState {
  token: string | null;
  user: Client | null;
  wallet: ClientWallet  | null;
  msg: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  wallet: null,,
  msg: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setMessage(state, action) {
      state.msg = action.payload;
    },
    setWallet(state, action) {
      state.wallet = action.payload;
    },
    resetAuth(state) {
      return initialState
    },
 },
});
export const { setToken, setUser, setWallet, resetAuth, setMessage } = authSlice.actions;

export default authSlice.reducer;

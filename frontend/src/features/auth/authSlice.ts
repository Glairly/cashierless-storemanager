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

interface Auth {
  id: number;
  username: String;
  email: string;
  face_id: number;
}

interface AuthState {
  token: string | null;
  user: Client | null;
  wallet: ClientWallet | null;
  auth: Auth | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  wallet: null,
  auth: null
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
    setWallet(state, action) {
      state.wallet = action.payload;
    },
    setAuth(state, action) {
      state.auth = action.payload;
    },
    resetAuth(state) {
      return initialState
    },
  },
});

export const { setToken, setUser, setWallet, setAuth, resetAuth } = authSlice.actions;

export default authSlice.reducer;

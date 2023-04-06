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
  pendingStatus: "idle" | "pending" | "fulfilled" | "rejected";
  isLoading: boolean;
  error: null;
  msg: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  wallet: null,
  auth: null,
  pendingStatus: null,
  isLoading: false,
  error: null,
  msg: null,
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
    setAuth(state, action) {
      state.auth = action.payload;
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
    resetAuth(state) {
      return initialState;
    },
  },
});

export const {
  setToken,
  setUser,
  setWallet,
  setAuth,
  resetAuth,
  setPending,
  setSuccess,
  setFailure,
  setMessage,
  setIdle,
} = authSlice.actions;

export default authSlice.reducer;

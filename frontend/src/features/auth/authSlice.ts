import { createSlice } from '@reduxjs/toolkit';
interface AuthState {
  token: string | null;
  user: Object | null;
  msg: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  msg: null
};

const authSlice = createSlice({
  name: 'auth',
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
    }
  },
});

export const { setToken, setUser, setMessage } = authSlice.actions;

export default authSlice.reducer;
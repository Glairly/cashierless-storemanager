import { createSlice } from "@reduxjs/toolkit";
import { Item } from "../inference/inferenceSlice";

interface supplyState {
  isThai: boolean;
}

const initialState: supplyState = {
  isThai: false,
};

const translationSlice = createSlice({
  name: "supply",
  initialState,
  reducers: {
    setIsThai(state) {
      state.isThai = !state.isThai
    }
  },
});

export const {
  setIsThai,
} = translationSlice.actions;

export default translationSlice.reducer;

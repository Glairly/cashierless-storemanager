import { createSlice } from "@reduxjs/toolkit";
import { Item } from "../inference/inferenceSlice";

export interface ItemType  {
  name: string;
  base_price: string;
  id: number;
}

interface supplyState {
  itemType: ItemType[];
  item: Item[];
  pendingStatus: "idle" | "pending" | "fulfilled" | "rejected";
  isLoading: boolean;
  error: string | null;
}

const initialState: supplyState = {
  itemType: [],
  item: [],
  pendingStatus: "idle",
  isLoading: false,
  error: null
};

const supplySlice = createSlice({
  name: "supply",
  initialState,
  reducers: {
    setItemType(state, action) {
      state.itemType = action.payload;
    },
    setItem(state, action) {
      state.item = action.payload;
    },
    resetSupply(state) {
      return initialState;
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
  setItemType,
  setItem,
  resetSupply,
  setIdle,
  setSuccess,
  setFailure,
  setPending
} = supplySlice.actions;

export default supplySlice.reducer;

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
}

const initialState: supplyState = {
  itemType: [],
  item: [],
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
  },
});

export const {
  setItemType,
  setItem,
  resetSupply,
} = supplySlice.actions;

export default supplySlice.reducer;

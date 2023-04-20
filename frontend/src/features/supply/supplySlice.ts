import { createSlice } from "@reduxjs/toolkit";

export interface Item {
  id: number;
  shop_id: number;
  quantity: number;
  name: string;
  price: number;
  type: string;
}

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
    }
  },
});

export const {
  setItemType,
  setItem
} = supplySlice.actions;

export default supplySlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

export interface ItemType  {
  name: string;
  base_price: string;
  id: number;
}

interface supplyState {
  itemType: ItemType[];
}

const initialState: supplyState = {
  itemType: [],
};

const supplySlice = createSlice({
  name: "supply",
  initialState,
  reducers: {
    setItemType(state, action) {
      state.itemType = action.payload;
    },
  },
});

export const {
  setItemType,
} = supplySlice.actions;

export default supplySlice.reducer;

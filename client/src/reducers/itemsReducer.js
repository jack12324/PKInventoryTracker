import { createSlice } from "@reduxjs/toolkit";
import itemsService from "../services/items";
import { setError } from "./errorReducer";
import { appendItemToDrawer } from "./drawersReducer";

const itemsSlice = createSlice({
  name: "items",
  initialState: [],
  reducers: {
    setItems: (state, action) => action.payload,
    clearItems: () => [],
    appendItem: (state, action) => {
      state.push(action.payload);
    },
  },
});

export const { setItems, clearItems, appendItem } = itemsSlice.actions;

export const initializeItems = () => async (dispatch) => {
  try {
    const items = await itemsService.getItems();
    dispatch(setItems(items));
  } catch (err) {
    if (err.name === "AxiosError") {
      dispatch(setError(err.response.data, "GET ITEMS"));
    } else {
      dispatch(setError(err, "GET ITEMS"));
    }
  }
};

export const addItem = (itemData) => async (dispatch) => {
  try {
    const item = await itemsService.addItem(itemData);
    dispatch(appendItem(item));
    dispatch(appendItemToDrawer({ drawer: itemData.drawer, item: item.id }));
    return true;
  } catch (err) {
    if (err.name === "AxiosError") {
      dispatch(setError(err.response.data, "ADD ITEM"));
    } else {
      console.error(err);
      dispatch(setError(err.message, "ADD ITEM"));
    }
    return false;
  }
};

export default itemsSlice.reducer;

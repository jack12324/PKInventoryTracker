import { createSlice } from "@reduxjs/toolkit";
import itemsService from "../services/items";
import { setError } from "./errorReducer";
// eslint-disable-next-line import/no-cycle
import { appendItemToDrawer, removeItemFromDrawer } from "./drawersReducer";

const itemsSlice = createSlice({
  name: "items",
  initialState: [],
  reducers: {
    setItems: (state, action) => action.payload,
    clearItems: () => [],
    appendItem: (state, action) => state.concat(action.payload),
    deleteItem: (state, action) =>
      state.filter((i) => i.id !== action.payload.id),
    deleteItemsOfDrawerId: (state, action) =>
      state.filter((i) => i.drawer !== action.payload),
    updateItem: (state, action) =>
      state.map((i) => (i.id === action.payload.id ? action.payload : i)),
  },
});

export const {
  setItems,
  clearItems,
  appendItem,
  deleteItem,
  updateItem,
  deleteItemsOfDrawerId,
} = itemsSlice.actions;

export const initializeItems = () => async (dispatch) => {
  try {
    const items = await itemsService.getItems();
    dispatch(setItems(items));
  } catch (err) {
    dispatch(setError(err, "GET ITEMS"));
  }
};

export const addItem = (itemData) => async (dispatch) => {
  try {
    const item = await itemsService.addItem(itemData);
    dispatch(appendItem(item));
    dispatch(appendItemToDrawer({ drawer: itemData.drawer, item: item.id }));
    return true;
  } catch (err) {
    dispatch(setError(err.message, "ADD ITEM"));
    return false;
  }
};

export const removeItem = (itemData) => async (dispatch) => {
  try {
    await itemsService.deleteItem(itemData.id);
    dispatch(deleteItem(itemData));
    dispatch(removeItemFromDrawer(itemData));
    return true;
  } catch (err) {
    dispatch(setError(err, "DELETE ITEM"));
    return false;
  }
};

export const editItem = (oldItem, itemData) => async (dispatch) => {
  try {
    await itemsService.updateItem(itemData.id, itemData);
    dispatch(updateItem(itemData));
    if (oldItem.drawer !== itemData.drawer) {
      dispatch(removeItemFromDrawer(oldItem));
      dispatch(appendItemToDrawer(itemData));
    }
    return true;
  } catch (err) {
    dispatch(setError(err, "EDIT ITEM"));
    return false;
  }
};
export default itemsSlice.reducer;

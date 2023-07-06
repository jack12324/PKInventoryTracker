import { createSlice } from "@reduxjs/toolkit";
import drawersService from "../services/drawers";
import { setError } from "./errorReducer";
// eslint-disable-next-line import/no-cycle
import {
  appendDrawerToCabinet,
  removeDrawerFromCabinet,
} from "./cabinetsReducer";
// eslint-disable-next-line import/no-cycle
import { deleteItemsOfDrawerId } from "./itemsReducer";

const drawersSlice = createSlice({
  name: "drawers",
  initialState: [],
  reducers: {
    setDrawers: (state, action) => action.payload,
    clearDrawers: () => [],
    appendDrawer: (state, action) => {
      state.push(action.payload);
    },
    appendItemToDrawer: (state, action) => {
      state
        .find((d) => d.id === action.payload.drawer)
        .items.push(action.payload.item);
    },
    removeItemFromDrawer: (state, action) => {
      const drawer = state.find((d) => d.id === action.payload.drawer);
      drawer.items = drawer.items.filter((i) => i !== action.payload.id);
    },
    deleteDrawer: (state, action) =>
      state.filter((d) => d.id !== action.payload.id),
    deleteDrawersOfCabinetId: (state, action) =>
      state.filter((d) => d.cabinet !== action.payload),
    updateDrawer: (state, action) =>
      state.map((d) => (d.id === action.payload.id ? action.payload : d)),
  },
});

export const {
  setDrawers,
  clearDrawers,
  appendDrawer,
  appendItemToDrawer,
  removeItemFromDrawer,
  deleteDrawer,
  deleteDrawersOfCabinetId,
  updateDrawer,
} = drawersSlice.actions;

export const initializeDrawers = () => async (dispatch) => {
  try {
    const drawers = await drawersService.getDrawers();
    dispatch(setDrawers(drawers));
  } catch (err) {
    dispatch(setError(err, "GET DRAWERS"));
  }
};

export const addDrawer = (drawerData) => async (dispatch) => {
  try {
    const drawer = await drawersService.addDrawer(drawerData);
    dispatch(appendDrawer(drawer));
    dispatch(
      appendDrawerToCabinet({ cabinet: drawerData.cabinet, drawer: drawer.id })
    );
    return true;
  } catch (err) {
    dispatch(setError(err, "ADD DRAWER"));
    return false;
  }
};
export const removeDrawer = (drawerData) => async (dispatch) => {
  try {
    await drawersService.deleteDrawer(drawerData.id);
    dispatch(deleteDrawer(drawerData));
    dispatch(removeDrawerFromCabinet(drawerData));
    dispatch(deleteItemsOfDrawerId(drawerData.id));
    return true;
  } catch (err) {
    dispatch(setError(err, "DELETE DRAWER"));
    return false;
  }
};

export const editDrawer = (oldDrawer, drawerData) => async (dispatch) => {
  try {
    await drawersService.updateDrawer(drawerData.id, drawerData);
    dispatch(updateDrawer(drawerData));
    if (oldDrawer.cabinet !== drawerData.cabinet) {
      dispatch(removeDrawerFromCabinet(oldDrawer));
      dispatch(appendDrawerToCabinet(drawerData));
    }
    return true;
  } catch (err) {
    dispatch(setError(err, "EDIT DRAWER"));
    return false;
  }
};

export default drawersSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import drawersService from "../services/drawers";
import { setError } from "./errorReducer";

const drawersSlice = createSlice({
  name: "drawers",
  initialState: [],
  reducers: {
    setDrawers: (state, action) => action.payload,
    clearDrawers: () => [],
    appendDrawer: (state, action) => {
      state.push(action.payload);
    },
  },
});

export const { setDrawers, clearDrawers, appendDrawer } = drawersSlice.actions;

export const initializeDrawers = () => async (dispatch) => {
  try {
    const drawers = await drawersService.getDrawers();
    dispatch(setDrawers(drawers));
  } catch (err) {
    if (err.name === "AxiosError") {
      dispatch(setError(err.response.data, "GET DRAWERS"));
    } else {
      dispatch(setError(err, "GET DRAWERS"));
    }
  }
};

export const addDrawer = (cabinetData) => async (dispatch) => {
  try {
    const cabinet = await drawersService.addDrawer(cabinetData);
    dispatch(appendDrawer(cabinet));
    return true;
  } catch (err) {
    if (err.name === "AxiosError") {
      dispatch(setError(err.response.data, "ADD DRAWER"));
    } else {
      dispatch(setError(err, "ADD DRAWER"));
    }
    return false;
  }
};

export default drawersSlice.reducer;

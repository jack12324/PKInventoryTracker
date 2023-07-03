import { createSlice } from "@reduxjs/toolkit";
import cabinetsService from "../services/cabinets";
import { setError } from "./errorReducer";
// eslint-disable-next-line import/no-cycle
import { initializeDrawers } from "./drawersReducer";

const cabinetsSlice = createSlice({
  name: "cabinets",
  initialState: [],
  reducers: {
    setCabinets: (state, action) => action.payload,
    clearCabinets: () => [],
    appendCabinet: (state, action) => {
      state.push(action.payload);
    },
    appendDrawerToCabinet: (state, action) => {
      state
        .find((c) => c.id === action.payload.cabinet)
        .drawers.push(action.payload.drawer);
    },
  },
});

export const {
  setCabinets,
  clearCabinets,
  appendCabinet,
  appendDrawerToCabinet,
} = cabinetsSlice.actions;

export const initializeCabinets = () => async (dispatch) => {
  try {
    const cabinets = await cabinetsService.getCabinets();
    dispatch(setCabinets(cabinets));
  } catch (err) {
    if (err.name === "AxiosError") {
      dispatch(setError(err.response.data, "GET CABINETS"));
    } else {
      dispatch(setError(err, "GET CABINETS"));
    }
  }
};

export const addCabinet = (cabinetData) => async (dispatch) => {
  try {
    const cabinet = await cabinetsService.addCabinet(cabinetData);
    dispatch(appendCabinet(cabinet));
    dispatch(initializeDrawers());
    return true;
  } catch (err) {
    if (err.name === "AxiosError") {
      dispatch(setError(err.response.data, "ADD CABINET"));
    } else {
      dispatch(setError(err, "ADD CABINET"));
    }
    return false;
  }
};

export default cabinetsSlice.reducer;

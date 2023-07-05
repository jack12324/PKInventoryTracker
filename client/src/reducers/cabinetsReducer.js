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
    deleteCabinet: (state, action) =>
      state.filter((c) => c.id !== action.payload),
    updateCabinet: (state, action) =>
      state.map((c) =>
        c.id === action.payload.id ? { ...c, name: action.payload.name } : c
      ),
  },
});

export const {
  setCabinets,
  clearCabinets,
  appendCabinet,
  appendDrawerToCabinet,
  deleteCabinet,
  updateCabinet,
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

export const removeCabinet = (cabinetData) => async (dispatch) => {
  try {
    await cabinetsService.deleteCabinet(cabinetData.id);
    dispatch(deleteCabinet(cabinetData.id));
    return true;
  } catch (err) {
    if (err.name === "AxiosError") {
      dispatch(setError(err.response.data, "DELETE CABINET"));
    } else {
      dispatch(setError(err, "DELETE CABINET"));
    }
    return false;
  }
};

export const editCabinet = (cabinetData) => async (dispatch) => {
  try {
    await cabinetsService.updateCabinet(cabinetData.id, cabinetData.name);
    dispatch(updateCabinet(cabinetData));
    return true;
  } catch (err) {
    if (err.name === "AxiosError") {
      dispatch(setError(err.response.data, "EDIT CABINET"));
    } else {
      dispatch(setError(err, "EDIT CABINET"));
    }
    return false;
  }
};

export default cabinetsSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import cabinetsService from "../services/cabinets";
import { setError } from "./errorReducer";

const cabinetsSlice = createSlice({
  name: "cabinets",
  initialState: [],
  reducers: {
    setCabinets: (state, action) => action.payload,
    clearCabinets: () => [],
    appendCabinet: (state, action) => {
      state.push(action.payload);
    },
  },
});

export const { setCabinets, clearCabinets, appendCabinet } =
  cabinetsSlice.actions;

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

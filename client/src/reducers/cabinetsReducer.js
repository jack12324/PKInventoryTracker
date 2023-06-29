import { createSlice } from "@reduxjs/toolkit";
import cabinetsService from "../services/cabinets";

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
  const cabinets = await cabinetsService.getCabinets();
  dispatch(setCabinets(cabinets));
};

export const addCabinet = (cabinetData) => async (dispatch) => {
  const cabinet = await cabinetsService.addCabinet(cabinetData);
  dispatch(appendCabinet(cabinet));
};

export default cabinetsSlice.reducer;

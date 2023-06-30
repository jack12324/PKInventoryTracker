import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import cabinetReducer from "./reducers/cabinetsReducer";
import errorReducer from "./reducers/errorReducer";
import drawersReducer from "./reducers/drawersReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    cabinets: cabinetReducer,
    drawers: drawersReducer,
    error: errorReducer,
  },
});

export default store;

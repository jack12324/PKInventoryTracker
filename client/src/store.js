import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import cabinetReducer from "./reducers/cabinetsReducer";
import errorReducer from "./reducers/errorReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    cabinets: cabinetReducer,
    error: errorReducer,
  },
});

export default store;

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import cabinetReducer from "./reducers/cabinetsReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    cabinets: cabinetReducer,
  },
});

export default store;

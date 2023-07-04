import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import cabinetReducer from "./reducers/cabinetsReducer";
import errorReducer from "./reducers/errorReducer";
import drawersReducer from "./reducers/drawersReducer";
import itemsReducer from "./reducers/itemsReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    cabinets: cabinetReducer,
    drawers: drawersReducer,
    items: itemsReducer,
    error: errorReducer,
  },
});

export default store;

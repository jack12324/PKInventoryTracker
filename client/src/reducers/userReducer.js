import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";
import { clearCabinets, initializeCabinets } from "./cabinetsReducer";
import tokenHelper from "../services/tokenHelper";
import { clearDrawers, initializeDrawers } from "./drawersReducer";
import { clearItems, initializeItems } from "./itemsReducer";

const LSUSERKEY = "PKInventoryUser";

export const userSlice = createSlice({
  name: "user",
  initialState: { initializing: true, loggedIn: false },
  reducers: {
    setUser: (state, action) => ({
      loggedIn: true,
      initializing: false,
      ...action.payload,
    }),
    clearUser: () => ({ loggedIn: false, initializing: false }),
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const loginUser = (credentials) => async (dispatch) => {
  const user = await loginService.login(credentials);
  dispatch(setUser(user));
  localStorage.setItem(LSUSERKEY, JSON.stringify(user));
  tokenHelper.setToken(user.token);
  dispatch(initializeCabinets());
  dispatch(initializeDrawers());
  dispatch(initializeItems());
};

export const logoutUser = () => (dispatch) => {
  dispatch(clearUser());
  localStorage.removeItem(LSUSERKEY);
  tokenHelper.setToken("");
  dispatch(clearCabinets());
  dispatch(clearDrawers());
  dispatch(clearItems());
};

export const initializeUser = () => async (dispatch) => {
  const localUser = localStorage.getItem(LSUSERKEY);
  if (localUser) {
    const user = JSON.parse(localUser);
    tokenHelper.setToken(user.token);
    dispatch(initializeCabinets());
    dispatch(initializeDrawers());
    dispatch(initializeItems());
    dispatch(setUser(user));
  } else {
    dispatch(clearUser());
    dispatch(clearCabinets());
    dispatch(clearDrawers());
    dispatch(clearItems());
  }
};

export default userSlice.reducer;

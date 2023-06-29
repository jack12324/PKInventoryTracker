import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";
import { errorToast, successToast } from "../components/alerts/Toasts";
import cabinetsService from "../services/cabinets";
import { clearCabinets, initializeCabinets } from "./cabinetsReducer";

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
  cabinetsService.setToken(user.token);
  dispatch(initializeCabinets());
};

export const logoutUser = () => (dispatch) => {
  dispatch(clearUser());
  localStorage.removeItem(LSUSERKEY);
  cabinetsService.setToken("");
  successToast("Log out successful");
  dispatch(clearCabinets());
};

export const initializeUser = () => async (dispatch) => {
  const localUser = localStorage.getItem(LSUSERKEY);
  if (localUser) {
    const user = JSON.parse(localUser);
    cabinetsService.setToken(user.token);
    try {
      dispatch(initializeCabinets());
      dispatch(setUser(user));
    } catch (err) {
      const message = err?.response?.data?.error?.message;
      if (message === "jwt expired") {
        dispatch(clearUser());
        errorToast("Your session token has expired, please log in again");
        localStorage.removeItem(LSUSERKEY);
      } else if (message) {
        errorToast(message);
      } else {
        errorToast("Some error occurred while loading cabinets");
      }
    }
  } else {
    dispatch(clearUser());
    dispatch(clearCabinets());
  }
};

export default userSlice.reducer;

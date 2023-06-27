import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";

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
};

export const logoutUser = () => (dispatch) => {
  dispatch(clearUser());
  localStorage.removeItem(LSUSERKEY);
};

export const initializeUser = () => (dispatch) => {
  const localUser = localStorage.getItem(LSUSERKEY);
  if (localUser) {
    const user = JSON.parse(localUser);
    dispatch(setUser(user));
  } else {
    dispatch(clearUser());
  }
};

export default userSlice.reducer;

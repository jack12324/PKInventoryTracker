import { createSlice } from "@reduxjs/toolkit";

const errorSlice = createSlice({
  name: "error",
  initialState: {
    active: false,
    name: "",
    message: "",
    error: null,
    scope: "GENERAL",
  },
  reducers: {
    setError: (state, action) => action.payload,
    clearError: () => ({
      active: false,
      name: "",
      error: null,
      scope: "GENERAL",
    }),
  },
});

export const { clearError } = errorSlice.actions;

export const createError = (err, area = "GENERAL") => {
  let name = area;
  let message = `Error while performing action`;
  let scope = "GENERAL";

  if (area === "ADD CABINET") {
    message = "Error while adding cabinet";
    scope = "ADD CABINET";
  }

  if (area === "ADD DRAWER") {
    message = "Error while adding drawer";
    scope = "ADD DRAWER";
  }

  if (area === "GET DRAWERS") {
    message = "Error while getting drawers";
    scope = "GENERAL";
  }

  if (area === "GET CABINETS") {
    message = "Error while getting cabinets";
    scope = "GENERAL";
  }

  if (err.error?.message === "jwt expired") {
    name = "JWT EXPIRED";
    message = "Your session has expired, please log in again";
    scope = "GENERAL";
  }
  return {
    active: true,
    name,
    message,
    scope,
    error: err,
  };
};

export const setError =
  (error, area = "GENERAL") =>
  (dispatch) => {
    dispatch(errorSlice.actions.setError(createError(error, area)));
  };

export default errorSlice.reducer;
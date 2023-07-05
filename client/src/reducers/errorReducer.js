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

  if (area === "ADD ITEM") {
    message = "Error while adding item";
    scope = "ADD ITEM";
  }

  if (area === "EDIT CABINET") {
    message = "Error while editing cabinet";
    scope = "EDIT CABINET";
  }

  if (area === "EDIT DRAWER") {
    message = "Error while editing drawer";
    scope = "EDIT DRAWER";
  }

  if (area === "EDIT ITEM") {
    message = "Error while editing item";
    scope = "EDIT ITEM";
  }

  if (area === "DELETE CABINET") {
    message = "Error while deleting cabinet";
    scope = "GENERAL";
  }

  if (area === "DELETE ITEM") {
    message = "Error while deleting item";
    scope = "GENERAL";
  }

  if (area === "DELETE DRAWER") {
    message = "Error while deleting drawer";
    scope = "GENERAL";
  }

  if (area === "GET DRAWERS") {
    message = "Error while getting drawers";
    scope = "GENERAL";
  }

  if (area === "GET ITEMS") {
    message = "Error while getting items";
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
    if (error.name === "AxiosError") {
      dispatch(
        errorSlice.actions.setError(createError(error.response.data, area))
      );
    } else if (error.message) {
      console.error(error);
      dispatch(errorSlice.actions.setError(createError(error.message, area)));
    } else {
      console.error(error);
      dispatch(errorSlice.actions.setError(createError("unknown error", area)));
    }
  };

export default errorSlice.reducer;

import { useBreakpointValue } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { clearError } from "../reducers/errorReducer";

// useBreakpoint loads base by default, which causes a flicker when loading. Since we aren't
// using server side rendering, we can turn off ssr here, which will stop the flicker from
// happening
export const useCsrBreakpointValue = (values, arg) =>
  useBreakpointValue(values, { ...arg, ssr: false });

export const useGlobalError = (scope) => {
  const globalError = useSelector((state) => state.error);
  const dispatch = useDispatch();

  const [error, setError] = useState("");

  useEffect(() => {
    if (globalError.active && globalError.scope === scope) {
      setError(globalError.message);
      dispatch(clearError());
    }
  }, [globalError]);

  return [error, setError];
};

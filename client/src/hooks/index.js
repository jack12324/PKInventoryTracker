import { useBreakpointValue } from "@chakra-ui/react";

// useBreakpoint loads base by default, which causes a flicker when loading. Since we aren't
// using server side rendering, we can turn off ssr here, which will stop the flicker from
// happening
// eslint-disable-next-line import/prefer-default-export
export const useCsrBreakpointValue = (values, arg) =>
  useBreakpointValue(values, { ...arg, ssr: false });

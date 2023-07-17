import { extendTheme, theme as baseTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#f5f9ed",
      100: "#d5e7b8",
      200: "#b0d17a",
      300: "#8bb249",
      400: "#7ca041",
      500: "#698737",
      600: "#58712e",
      700: "#475b25",
      800: "#3c4d1f",
      900: "#2b3717",
    },
    link: baseTheme.colors.green,
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "brand",
      },
    },
  },
});

export default theme;

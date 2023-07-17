import { Heading, HStack } from "@chakra-ui/react";
import CurrentUser from "../CurrentUser";
import { useCsrBreakpointValue } from "../../hooks";
import Logo from "../icons/logo";

function NavBar() {
  const isMobile = useCsrBreakpointValue({ base: true, sm: false });
  return (
    <HStack
      as="nav"
      spacing={{ base: "8", sm: "10" }}
      justify="space-between"
      pt="2"
      pb="2"
      borderBottomWidth="1px"
    >
      {isMobile ? (
        <>
          <Logo boxSize={24} color="brand.400" />
          <CurrentUser />
        </>
      ) : (
        <>
          <Logo boxSize={24} color="brand.400" />
          <Heading>P&K Inventory </Heading>
          <CurrentUser />
        </>
      )}
    </HStack>
  );
}
export default NavBar;

import { Heading, HStack, IconButton } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import CurrentUser from "../CurrentUser";
import { useCsrBreakpointValue } from "../../hooks";

function NavBar() {
  const isMobile = useCsrBreakpointValue({ base: true, md: false });
  return (
    <HStack
      as="nav"
      spacing={{ base: "8", sm: "10" }}
      justify="space-between"
      pt="2"
      pb="2"
      borderBottomWidth="1px"
      w="100%"
    >
      {isMobile ? (
        <>
          <IconButton aria-label="Open Nav Menu" icon={<HamburgerIcon />} />
          <CurrentUser />
        </>
      ) : (
        <>
          <div />
          <Heading size="lg">P&K Inventory </Heading>
          <CurrentUser />
        </>
      )}
    </HStack>
  );
}
export default NavBar;

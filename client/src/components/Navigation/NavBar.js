import { Heading, HStack, IconButton } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";
import CurrentUser from "../CurrentUser";
import { useCsrBreakpointValue } from "../../hooks";
import Logo from "../icons/logo";

function NavBar({ mobileOnOpen }) {
  const isMobile = useCsrBreakpointValue({ base: true, md: false });
  return (
    <HStack
      as="nav"
      justify="space-between"
      pt="2"
      pb="2"
      borderBottomWidth="1px"
      w="100%"
    >
      {isMobile ? (
        <>
          <IconButton
            aria-label="Open Nav Menu"
            icon={<HamburgerIcon />}
            onClick={mobileOnOpen}
          />
          <Logo />
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

NavBar.propTypes = {
  mobileOnOpen: PropTypes.func.isRequired,
};
export default NavBar;

import { HStack } from "@chakra-ui/react";
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
    >
      {isMobile ? (
        <HStack>
          <CurrentUser />
        </HStack>
      ) : (
        <HStack justify="space-between" spacing="8">
          <HStack>
            <CurrentUser />
          </HStack>
        </HStack>
      )}
    </HStack>
  );
}
export default NavBar;

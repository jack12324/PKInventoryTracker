import { Box, VStack } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import PropTypes from "prop-types";
import Logo from "../icons/logo";
import NavBar from "./NavBar";
import NavItem from "./NavItem";

function SideBar({ links }) {
  const sidebarWidth = 48;
  return (
    <Box minH="100vh">
      <VStack
        align="left"
        borderRight="1px"
        borderColor="gray.300"
        h="full"
        w={{ base: 0, md: sidebarWidth }}
        pos="fixed"
        spacing={2}
        pt={2}
        display={{ base: "none", md: "block" }}
      >
        <Logo w={24} h={12} color="brand.400" mb={4} />
        {links.map((l) => (
          <NavItem key={l.name} linkObject={l} />
        ))}
      </VStack>
      <Box ml={{ base: 0, md: sidebarWidth }}>
        <NavBar />
        <Box mt={2} ml={{ base: 0, md: 4 }}>
          <Routes>
            {links.map((l) => (
              <Route key={l.dest} path={l.dest} element={l.element} />
            ))}
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

SideBar.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      dest: PropTypes.string.isRequired,
      element: PropTypes.node.isRequired,
    })
  ).isRequired,
};

export default SideBar;

import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import PropTypes from "prop-types";
import NavBar from "./NavBar";
import SideBarContents from "./SideBarContents";
import { linkObject } from "../../types";

function SideBarWithNavBar({ links }) {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const sidebarWidth = 48;
  return (
    <>
      <Box minH="100vh">
        <Box
          borderRight="1px"
          borderColor="gray.300"
          h="full"
          w={{ base: 0, md: sidebarWidth }}
          display={{ base: "none", md: "block" }}
          pos="fixed"
        >
          <SideBarContents links={links} sidebarWidth={sidebarWidth} />
        </Box>
        <Box ml={{ base: 0, md: sidebarWidth }}>
          <NavBar mobileOnOpen={onOpen} />
          <Box mt={2} ml={{ base: 0, md: 4 }}>
            <Routes>
              {links.map((l) => (
                <Route key={l.dest} path={l.dest} element={l.element} />
              ))}
            </Routes>
          </Box>
        </Box>
      </Box>
      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
            <SideBarContents
              sidebarWidth={sidebarWidth}
              links={links}
              onAnyClick={onClose}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

SideBarWithNavBar.propTypes = {
  links: PropTypes.arrayOf(linkObject).isRequired,
};

export default SideBarWithNavBar;

import { VStack } from "@chakra-ui/react";
import PropTypes from "prop-types";
import Logo from "../icons/logo";
import NavItem from "./NavItem";
import { linkObject } from "../../types";

function SideBarContents({ links, onAnyClick }) {
  return (
    <VStack align="left" spacing={2} pt={2}>
      <Logo mb={4} />
      {links.map((l) => (
        <NavItem key={l.name} linkItem={l} onClick={onAnyClick} />
      ))}
    </VStack>
  );
}

SideBarContents.propTypes = {
  links: PropTypes.arrayOf(linkObject).isRequired,
  onAnyClick: PropTypes.func,
};

SideBarContents.defaultProps = {
  onAnyClick: null,
};

export default SideBarContents;

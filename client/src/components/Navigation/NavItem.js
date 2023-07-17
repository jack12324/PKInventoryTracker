import { HStack, Icon, Link, Text } from "@chakra-ui/react";
import { Link as ReactLink } from "react-router-dom";
import PropTypes from "prop-types";

function NavItem({ linkObject }) {
  return (
    <Link
      key={linkObject.name}
      as={ReactLink}
      to={linkObject.dest}
      style={{ textDecoration: "none" }}
    >
      <HStack
        align="center"
        p={2}
        mx={2}
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "brand.500",
          color: "white",
        }}
      >
        <Icon
          _groupHover={{
            color: "white",
          }}
          as={linkObject.icon}
        />
        <Text>{linkObject.name}</Text>
      </HStack>
    </Link>
  );
}

NavItem.propTypes = {
  linkObject: PropTypes.shape({
    name: PropTypes.string.isRequired,
    dest: PropTypes.string.isRequired,
    icon: PropTypes.objectOf((prop) => {
      if (!prop.displayName.includes("Icon")) {
        return new Error(
          `prop icon should be of type Icon. Got displayName: ${prop.displayName}`
        );
      }
      return true;
    }),
  }).isRequired,
};

export default NavItem;

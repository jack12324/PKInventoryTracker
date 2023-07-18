import { HStack, Icon, Link, Text } from "@chakra-ui/react";
import { Link as ReactLink } from "react-router-dom";
import PropTypes from "prop-types";
import { linkObject } from "../../types";

function NavItem({ linkItem, onClick }) {
  return (
    <Link
      key={linkItem.name}
      as={ReactLink}
      to={linkItem.dest}
      style={{ textDecoration: "none" }}
      onClick={onClick}
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
          as={linkItem.icon}
        />
        <Text>{linkItem.name}</Text>
      </HStack>
    </Link>
  );
}

NavItem.propTypes = {
  linkItem: linkObject.isRequired,
  onClick: PropTypes.func,
};

NavItem.defaultProps = {
  onClick: null,
};

export default NavItem;

import PropTypes from "prop-types";
import { IconButton } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

function ShowHideIconButton({ isOpen, onToggle }) {
  return (
    <IconButton
      aria-label={isOpen ? "hide contents" : "show contents"}
      onClick={onToggle}
      icon={isOpen ? <ViewOffIcon /> : <ViewIcon />}
    />
  );
}

ShowHideIconButton.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default ShowHideIconButton;

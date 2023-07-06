import { IconButton, useDisclosure } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import ModalWrapper from "../forms/ModalWrapper";

function EditButton({ name, children }) {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const user = useSelector((state) => state.user);
  return user.admin ? (
    <>
      <ModalWrapper onClose={onClose} isOpen={isOpen} heading={`Edit ${name}`}>
        {children}
      </ModalWrapper>
      <IconButton
        aria-label={`Edit ${name}`}
        icon={<EditIcon />}
        onClick={onOpen}
      />
    </>
  ) : null;
}

EditButton.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default EditButton;

import { IconButton, useDisclosure } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import ConfirmAlert from "../alerts/ConfirmAlert";

function DeleteButton({ name, handleDelete, isDeleting, body }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const user = useSelector((state) => state.user);
  return user.admin ? (
    <>
      {isOpen && (
        <ConfirmAlert
          onClose={onClose}
          isOpen={isOpen}
          header={`Delete ${name}`}
          body={body}
          confirmText="Delete"
          confirmed={handleDelete}
          isSubmitting={isDeleting}
        />
      )}
      <IconButton
        aria-label={`Delete ${name}`}
        icon={<DeleteIcon />}
        colorScheme="red"
        onClick={onOpen}
      />
    </>
  ) : null;
}

DeleteButton.propTypes = {
  name: PropTypes.string.isRequired,
  handleDelete: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  body: PropTypes.string.isRequired,
};

export default DeleteButton;

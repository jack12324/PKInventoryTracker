import { IconButton, useDisclosure } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";
import ConfirmAlert from "../alerts/ConfirmAlert";

function DeleteButton({ name, handleDelete, isDeleting, body }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
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
  );
}

DeleteButton.propTypes = {
  name: PropTypes.string.isRequired,
  handleDelete: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  body: PropTypes.string.isRequired,
};

export default DeleteButton;

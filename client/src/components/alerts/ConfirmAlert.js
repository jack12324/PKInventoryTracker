import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";
import PropTypes from "prop-types";

function ConfirmAlert({
  isOpen,
  onClose,
  confirmed,
  header,
  body,
  confirmText,
  isSubmitting,
}) {
  const cancelRef = useRef();
  const confirmClicked = async () => {
    await confirmed();
    onClose();
  };

  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>{header}</AlertDialogHeader>
        <AlertDialogBody>{body}</AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="red"
            onClick={confirmClicked}
            ml="3"
            data-cy="alert-confirm-button"
            isLoading={isSubmitting}
          >
            {confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

ConfirmAlert.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  confirmed: PropTypes.func.isRequired,
  header: PropTypes.string.isRequired,
  body: PropTypes.node.isRequired,
  confirmText: PropTypes.string.isRequired,
  isSubmitting: PropTypes.bool,
};

ConfirmAlert.defaultProps = {
  isSubmitting: false,
};

export default ConfirmAlert;

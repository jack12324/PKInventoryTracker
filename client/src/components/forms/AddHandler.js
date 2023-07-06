import { Button, useDisclosure } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";
import ModalWrapper from "./ModalWrapper";

function AddHandler({ addName, children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button rightIcon={<AddIcon />} variant="solid" onClick={onOpen} w="100%">
        Add {addName}
      </Button>
      <ModalWrapper
        onClose={onClose}
        isOpen={isOpen}
        heading={`Add a ${addName}`}
      >
        {children}
      </ModalWrapper>
    </>
  );
}

AddHandler.propTypes = {
  addName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default AddHandler;

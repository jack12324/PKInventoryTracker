import { Button, useDisclosure } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";
import AddModal from "./AddModal";

function AddHandler({ addName, children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button rightIcon={<AddIcon />} variant="solid" onClick={onOpen}>
        Add {addName}
      </Button>
      <AddModal onClose={onClose} isOpen={isOpen} heading={`Add a ${addName}`}>
        {children}
      </AddModal>
    </>
  );
}

AddHandler.propTypes = {
  addName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default AddHandler;

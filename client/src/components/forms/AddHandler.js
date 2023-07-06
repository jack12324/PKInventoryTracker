import { Button, useDisclosure } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import ModalWrapper from "./ModalWrapper";

function AddHandler({ addName, children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useSelector((state) => state.user);
  return user.admin ? (
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
  ) : null;
}

AddHandler.propTypes = {
  addName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default AddHandler;

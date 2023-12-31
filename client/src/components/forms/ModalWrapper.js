import {
  Heading,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

function ModalWrapper({ isOpen, onClose, heading, children }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent w="95%">
        <ModalHeader>
          <Heading>{heading}</Heading>
        </ModalHeader>
        <ModalCloseButton />
        {children}
      </ModalContent>
    </Modal>
  );
}

ModalWrapper.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
export default ModalWrapper;

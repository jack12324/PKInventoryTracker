import PropTypes from "prop-types";
import {
  Box,
  Button,
  Collapse,
  HStack,
  IconButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { createSelector } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { useState } from "react";
import store from "../store";
import ConfirmAlert from "./alerts/ConfirmAlert";
import { removeCabinet } from "../reducers/cabinetsReducer";
import ModalWrapper from "./ModalWrapper";
import ModalEditCabinetForm from "./forms/ModalEditCabinetForm";

function Cabinet({ cabinet }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen, onToggle } = useDisclosure();
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const getDrawers = createSelector(
    (state) => state?.drawers,
    (drawers) =>
      [...drawers.filter((d) => d.cabinet === cabinet.id)].sort(
        (a, b) => b.position - a.position
      )
  );
  const drawers = getDrawers(store.getState());
  const dispatch = useDispatch();

  const handleDelete = async () => {
    setIsDeleting(true);
    await dispatch(removeCabinet(cabinet));
    setIsDeleting(false);
  };

  return (
    <>
      <ModalWrapper
        onClose={onEditClose}
        isOpen={isEditOpen}
        heading="Edit Cabinet"
      >
        <ModalEditCabinetForm cabinet={cabinet} />
      </ModalWrapper>

      {isConfirmOpen && (
        <ConfirmAlert
          onClose={onConfirmClose}
          isOpen={isConfirmOpen}
          header="Delete Cabinet"
          body={
            "You are about to delete a cabinet. All of its contents will also be deleted. You can't undo this action"
          }
          confirmText="Delete"
          confirmed={handleDelete}
          isSubmitting={isDeleting}
        />
      )}
      <Box p={2} shadow="md" borderWidth="1px" w="100%">
        <HStack justify="space-between">
          <Text>{cabinet.name}</Text>
          <HStack justify="space-between">
            <Button onClick={onToggle}>
              {isOpen ? "Hide Contents" : "Show Contents"}
            </Button>
            <IconButton
              aria-label="Edit cabinet name"
              icon={<EditIcon />}
              onClick={onEditOpen}
            />
            <IconButton
              aria-label="Delete cabinet"
              icon={<DeleteIcon />}
              colorScheme="red"
              onClick={onConfirmOpen}
            />
          </HStack>
        </HStack>
        <Collapse in={isOpen} animateOpacity>
          {drawers ? (
            drawers.map((d) => <Text key={d.id}>{d.position}</Text>)
          ) : (
            <Text>Cabinet is Empty</Text>
          )}
          <Box />
        </Collapse>
      </Box>
    </>
  );
}

Cabinet.propTypes = {
  cabinet: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    drawers: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};
export default Cabinet;

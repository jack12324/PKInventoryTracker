import PropTypes from "prop-types";
import {
  Box,
  Collapse,
  HStack,
  IconButton,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { createSelector } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { useState } from "react";
import store from "../../store";
import ConfirmAlert from "../alerts/ConfirmAlert";
import { removeCabinet } from "../../reducers/cabinetsReducer";
import ModalWrapper from "../forms/ModalWrapper";
import ModalEditCabinetForm from "../forms/ModalEditCabinetForm";
import Drawer from "./Drawer";
import ShowHideIconButton from "../misc/ShowHideIconButton";
import AddHandler from "../forms/AddHandler";
import ModalDrawerForm from "../forms/ModalDrawerForm";

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
            <ShowHideIconButton onToggle={onToggle} isOpen={isOpen} />
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
          <VStack p={4}>
            <AddHandler addName="Drawer">
              <ModalDrawerForm cabinet={cabinet} />
            </AddHandler>
            {drawers && drawers.length > 0
              ? drawers.map((d) => <Drawer drawer={d} key={d.id} />)
              : null}
          </VStack>
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

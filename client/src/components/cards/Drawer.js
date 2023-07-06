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
import ModalWrapper from "../forms/ModalWrapper";
import { removeDrawer } from "../../reducers/drawersReducer";
import ModalEditDrawerForm from "../forms/ModalEditDrawerForm";
import Item from "./Item";
import ShowHideIconButton from "../misc/ShowHideIconButton";

function Drawer({ drawer }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
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
  const getItems = createSelector(
    (state) => state?.items,
    (items) =>
      [...items.filter((i) => i.drawer === drawer.id)].sort((a, b) =>
        b.name > a.name ? 1 : -1
      )
  );
  const items = getItems(store.getState());
  const dispatch = useDispatch();

  const handleDelete = async () => {
    setIsDeleting(true);
    await dispatch(removeDrawer(drawer));
    setIsDeleting(false);
  };

  return (
    <>
      <ModalWrapper
        onClose={onEditClose}
        isOpen={isEditOpen}
        heading="Edit Drawer"
      >
        <ModalEditDrawerForm drawer={drawer} />
      </ModalWrapper>

      {isConfirmOpen && (
        <ConfirmAlert
          onClose={onConfirmClose}
          isOpen={isConfirmOpen}
          header="Delete Drawer"
          body={
            "You are about to delete a drawer. All of its contents will also be deleted. You can't undo this action"
          }
          confirmText="Delete"
          confirmed={handleDelete}
          isSubmitting={isDeleting}
        />
      )}
      <Box p={2} shadow="md" borderWidth="1px" w="100%">
        <HStack justify="space-between">
          <Text>
            {`Drawer ${drawer.position}`}
            {drawer.name ? ` - ${drawer.name}` : ""}
          </Text>
          <HStack justify="space-between">
            <ShowHideIconButton onToggle={onToggle} isOpen={isOpen} />
            <IconButton
              aria-label="Edit drawer"
              icon={<EditIcon />}
              onClick={onEditOpen}
            />
            <IconButton
              aria-label="Delete drawer"
              icon={<DeleteIcon />}
              colorScheme="red"
              onClick={onConfirmOpen}
            />
          </HStack>
        </HStack>
        <Collapse in={isOpen} animateOpacity>
          <VStack p={4}>
            {items && items.length > 0 ? (
              items.map((i) => <Item item={i} key={i.id} />)
            ) : (
              <Text>Drawer is Empty</Text>
            )}
          </VStack>
        </Collapse>
      </Box>
    </>
  );
}

Drawer.propTypes = {
  drawer: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    position: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};
export default Drawer;

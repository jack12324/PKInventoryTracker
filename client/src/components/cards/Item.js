import PropTypes from "prop-types";
import { Box, HStack, IconButton, Text, useDisclosure } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useDispatch } from "react-redux";
import { useState } from "react";
import ConfirmAlert from "../alerts/ConfirmAlert";
import ModalWrapper from "../forms/ModalWrapper";
import { removeItem } from "../../reducers/itemsReducer";
import ModalEditItemForm from "../forms/ModalEditItemForm";

function Item({ item }) {
  const [isDeleting, setIsDeleting] = useState(false);
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
  const dispatch = useDispatch();

  const handleDelete = async () => {
    setIsDeleting(true);
    await dispatch(removeItem(item));
    setIsDeleting(false);
  };

  return (
    <>
      <ModalWrapper
        onClose={onEditClose}
        isOpen={isEditOpen}
        heading="Edit Item"
      >
        <ModalEditItemForm item={item} />
      </ModalWrapper>

      {isConfirmOpen && (
        <ConfirmAlert
          onClose={onConfirmClose}
          isOpen={isConfirmOpen}
          header="Delete Item"
          body={"You are about to delete a Item. You can't undo this action"}
          confirmText="Delete"
          confirmed={handleDelete}
          isSubmitting={isDeleting}
        />
      )}
      <Box p={2} shadow="md" borderWidth="1px" w="100%">
        <HStack justify="space-between">
          <Text>{item.name}</Text>
          <HStack justify="space-between">
            <IconButton
              aria-label="Edit item"
              icon={<EditIcon />}
              onClick={onEditOpen}
            />
            <IconButton
              aria-label="Delete item"
              icon={<DeleteIcon />}
              colorScheme="red"
              onClick={onConfirmOpen}
            />
          </HStack>
        </HStack>
      </Box>
    </>
  );
}

Item.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    drawer: PropTypes.string.isRequired,
  }).isRequired,
};
export default Item;

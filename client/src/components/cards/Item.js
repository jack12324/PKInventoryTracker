import PropTypes from "prop-types";
import { Box, HStack, IconButton, Text, useDisclosure } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { useDispatch } from "react-redux";
import { useState } from "react";
import ModalWrapper from "../forms/ModalWrapper";
import { removeItem } from "../../reducers/itemsReducer";
import ModalEditItemForm from "../forms/ModalEditItemForm";
import DeleteButton from "../misc/DeleteButton";

function Item({ item }) {
  const [isDeleting, setIsDeleting] = useState(false);
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
      <Box p={2} shadow="md" borderWidth="1px" w="100%">
        <HStack justify="space-between">
          <Text>{item.name}</Text>
          <HStack justify="space-between">
            <IconButton
              aria-label="Edit item"
              icon={<EditIcon />}
              onClick={onEditOpen}
            />
            <DeleteButton
              isDeleting={isDeleting}
              name="Item"
              body={
                "You are about to delete a Item. You can't undo this action"
              }
              handleDelete={handleDelete}
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

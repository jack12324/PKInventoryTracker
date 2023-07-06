import PropTypes from "prop-types";
import { Box, HStack, Text } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { removeItem } from "../../reducers/itemsReducer";
import ModalEditItemForm from "../forms/ModalEditItemForm";
import DeleteButton from "../misc/DeleteButton";
import EditButton from "../misc/EditButton";

function Item({ item }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();

  const handleDelete = async () => {
    setIsDeleting(true);
    await dispatch(removeItem(item));
    setIsDeleting(false);
  };

  return (
    <Box p={2} shadow="md" borderWidth="1px" w="100%">
      <HStack justify="space-between">
        <Text>{item.name}</Text>
        <HStack justify="space-between">
          <EditButton name="Item">
            <ModalEditItemForm item={item} />
          </EditButton>
          <DeleteButton
            isDeleting={isDeleting}
            name="Item"
            body={"You are about to delete a Item. You can't undo this action"}
            handleDelete={handleDelete}
          />
        </HStack>
      </HStack>
    </Box>
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

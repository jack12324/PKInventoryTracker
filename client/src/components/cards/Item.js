import PropTypes from "prop-types";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { removeItem } from "../../reducers/itemsReducer";
import ModalEditItemForm from "../forms/ModalEditItemForm";
import DeleteButton from "../misc/DeleteButton";
import EditButton from "../misc/EditButton";

function Item({ item, verbose }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();
  const drawer = verbose
    ? useSelector((state) => state.drawers.find((d) => d.id === item?.drawer))
    : null;
  const cabinet = verbose
    ? useSelector((state) =>
        state.cabinets.find((c) => c.id === drawer?.cabinet)
      )
    : null;

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
          {verbose && cabinet && drawer ? (
            <VStack alignItems="left" pr={8}>
              <Text>{`${cabinet.name}`}</Text>
              <Text>{`Drawer ${drawer.position}${
                drawer.name ? ` - ${drawer.name}` : ""
              }`}</Text>
            </VStack>
          ) : null}
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
  verbose: PropTypes.bool,
};
Item.defaultProps = {
  verbose: false,
};
export default Item;

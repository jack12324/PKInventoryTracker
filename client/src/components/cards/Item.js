import PropTypes from "prop-types";
import { Box, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { removeItem } from "../../reducers/itemsReducer";
import ModalEditItemForm from "../forms/ModalEditItemForm";
import DeleteButton from "../misc/DeleteButton";
import EditButton from "../misc/EditButton";
import { useCsrBreakpointValue } from "../../hooks";

function Item({ item, verbose }) {
  const isMobile = useCsrBreakpointValue({ base: true, md: false });
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
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
      <Stack
        direction={isMobile ? "column" : "row"}
        justify="space-between"
        spacing={4}
      >
        <Text
          isTruncated
          maxW={user.admin ? { base: "100%", md: "50%" } : "100%"}
        >
          {item.name}
        </Text>
        <HStack
          justify="space-between"
          w={{ base: "100%", md: "50%" }}
          display={verbose || user.admin ? "flex" : "none"}
        >
          {verbose && cabinet && drawer ? (
            <VStack alignItems="left" w={user.admin ? "60%" : "100%"}>
              <Text noOfLines={1}>{`${cabinet.name}`}</Text>
              <Text noOfLines={1}>{`Drawer ${drawer.position}${
                drawer.name ? ` - ${drawer.name}` : ""
              }`}</Text>
            </VStack>
          ) : (
            <div />
          )}
          <HStack>
            <EditButton name="Item">
              <ModalEditItemForm item={item} />
            </EditButton>
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
      </Stack>
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

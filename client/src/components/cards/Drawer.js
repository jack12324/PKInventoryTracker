import PropTypes from "prop-types";
import {
  Box,
  Collapse,
  HStack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { removeDrawer } from "../../reducers/drawersReducer";
import ModalEditDrawerForm from "../forms/ModalEditDrawerForm";
import Item from "./Item";
import ShowHideIconButton from "../misc/ShowHideIconButton";
import AddHandler from "../forms/AddHandler";
import ModalItemForm from "../forms/ModalItemForm";
import DeleteButton from "../misc/DeleteButton";
import EditButton from "../misc/EditButton";

function Drawer({ drawer }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

  const allItems = useSelector((state) => state.items);
  const items = allItems
    .filter((i) => i.drawer === drawer.id)
    .sort((a, b) => (b.name > a.name ? -1 : 1));

  const dispatch = useDispatch();

  const handleDelete = async () => {
    setIsDeleting(true);
    await dispatch(removeDrawer(drawer));
    setIsDeleting(false);
  };

  return (
    <Box p={2} shadow="md" borderWidth="1px" w="100%">
      <HStack justify="space-between">
        <Text maxW="50%" noOfLines={2}>
          {`Drawer ${drawer.position}`}
          {drawer.name ? ` - ${drawer.name}` : ""}
        </Text>
        <HStack justify="space-between">
          <ShowHideIconButton onToggle={onToggle} isOpen={isOpen} />
          <EditButton name="Drawer">
            <ModalEditDrawerForm drawer={drawer} />
          </EditButton>
          <DeleteButton
            isDeleting={isDeleting}
            name="Drawer"
            body={
              "You are about to delete a drawer. All of its contents will also be deleted. You can't undo this action"
            }
            handleDelete={handleDelete}
          />
        </HStack>
      </HStack>
      <Collapse in={isOpen} animateOpacity>
        <VStack p={4}>
          <AddHandler addName="Item">
            <ModalItemForm drawer={drawer} />
          </AddHandler>
          {items && items.length > 0
            ? items.map((i) => <Item item={i} key={i.id} />)
            : null}
        </VStack>
      </Collapse>
    </Box>
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

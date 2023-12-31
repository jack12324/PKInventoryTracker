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
import { removeCabinet } from "../../reducers/cabinetsReducer";
import ModalEditCabinetForm from "../forms/ModalEditCabinetForm";
import Drawer from "./Drawer";
import ShowHideIconButton from "../misc/ShowHideIconButton";
import AddHandler from "../forms/AddHandler";
import ModalDrawerForm from "../forms/ModalDrawerForm";
import DeleteButton from "../misc/DeleteButton";
import EditButton from "../misc/EditButton";

function Cabinet({ cabinet }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen, onToggle } = useDisclosure();
  const allDrawers = useSelector((state) => state.drawers);
  const drawers = allDrawers
    .filter((d) => d.cabinet === cabinet.id)
    .sort((a, b) => a.position - b.position);
  const dispatch = useDispatch();

  const handleDelete = async () => {
    setIsDeleting(true);
    await dispatch(removeCabinet(cabinet));
    setIsDeleting(false);
  };

  return (
    <Box p={2} shadow="md" borderWidth="1px" w="100%">
      <HStack justify="space-between">
        <Text noOfLines={2} maxW="50%">
          {cabinet.name}
        </Text>
        <HStack justify="space-between">
          <ShowHideIconButton onToggle={onToggle} isOpen={isOpen} />
          <EditButton name="Cabinet">
            <ModalEditCabinetForm cabinet={cabinet} />
          </EditButton>
          <DeleteButton
            isDeleting={isDeleting}
            name="Cabinet"
            body={
              "You are about to delete a cabinet. All of its contents will also be deleted. You can't undo this action"
            }
            handleDelete={handleDelete}
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

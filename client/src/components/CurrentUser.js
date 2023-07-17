import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Button,
  Center,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { logoutUser } from "../reducers/userReducer";
import { successToast } from "./alerts/Toasts";

function CurrentUser() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
    successToast("Log out successful");
  };

  return (
    <Menu>
      <MenuButton>
        <HStack>
          <Avatar size="sm" />
          <VStack alignItems="flex-start" ml={2} spacing="1px">
            <Text fontSize="sm" fontWeight="semibold">
              {user.username}
            </Text>
            {user.admin ? (
              <Text fontSize="xs" color="gray.600">
                admin
              </Text>
            ) : null}
          </VStack>
          <ChevronDownIcon />
        </HStack>
      </MenuButton>
      <MenuList>
        <Center>
          <Button variant="outline" fontSize="lg" onClick={onLogout} w="90%">
            Log Out
          </Button>
        </Center>
      </MenuList>
    </Menu>
  );
}

export default CurrentUser;

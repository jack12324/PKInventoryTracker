import { useDispatch, useSelector } from "react-redux";
import { Button, HStack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useCsrBreakpointValue } from "../hooks";
import { logoutUser } from "../reducers/userReducer";

function CurrentUser() {
  const user = useSelector((state) => state.user);
  const isMobile = useCsrBreakpointValue({ base: true, md: false });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <HStack justify="space-between" spacing="4" fontSize="lg">
      {isMobile ? null : (
        <Text color="grey.800" fontWeight="semibold">
          Welcome {user.admin ? "admin" : ""} {user.username}!
        </Text>
      )}
      <Button
        variant="outline"
        colorScheme="gray"
        fontSize="lg"
        onClick={onLogout}
      >
        Log Out
      </Button>
    </HStack>
  );
}

export default CurrentUser;

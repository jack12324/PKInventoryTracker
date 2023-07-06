import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Heading, Text, VStack } from "@chakra-ui/react";
import NavBar from "../Navigation/NavBar";
import AddHandler from "../forms/AddHandler";
import ModalCabinetForm from "../forms/ModalCabinetForm";
import Cabinet from "../cards/Cabinet";

function HomePage() {
  const user = useSelector((state) => state.user);
  const cabinets = useSelector((state) => state.cabinets);

  if (!user || user.initializing) return null;

  return user.loggedIn ? (
    <>
      <NavBar />
      <Heading>Cabinets</Heading>
      {cabinets ? (
        <VStack>
          <AddHandler addName="Cabinet">
            <ModalCabinetForm />
          </AddHandler>
          {cabinets.map((c) => (
            <Cabinet key={c.id} cabinet={c} />
          ))}
        </VStack>
      ) : (
        <Text>There are no cabinets</Text>
      )}
    </>
  ) : (
    <Navigate to="/login" />
  );
}

export default HomePage;

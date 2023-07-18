import { Heading, Text, VStack } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import AddHandler from "../forms/AddHandler";
import ModalCabinetForm from "../forms/ModalCabinetForm";
import Cabinet from "../cards/Cabinet";

function CabinetsPage() {
  const cabinets = useSelector((state) => state.cabinets);

  return (
    <>
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
  );
}

export default CabinetsPage;

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useTheme,
  VStack,
} from "@chakra-ui/react";
import NavBar from "../Navigation/NavBar";
import AddHandler from "../forms/AddHandler";
import ModalCabinetForm from "../forms/ModalCabinetForm";
import Cabinet from "../cards/Cabinet";
import ItemsPage from "./ItemsPage";

function HomePage() {
  const user = useSelector((state) => state.user);
  const cabinets = useSelector((state) => state.cabinets);
  const theme = useTheme();

  if (!user || user.initializing) return null;

  return user.loggedIn ? (
    <Container w={{ xl: theme.breakpoints.xl }} maxW="100%">
      <NavBar />
      <Tabs>
        <TabList>
          <Tab>Items</Tab>
          <Tab>Cabinets</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ItemsPage />
          </TabPanel>
          <TabPanel>
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
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  ) : (
    <Navigate to="/login" />
  );
}

export default HomePage;

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useTheme,
} from "@chakra-ui/react";
import { SearchIcon, ViewIcon } from "@chakra-ui/icons";
import ItemsPage from "./ItemsPage";
import CabinetsPage from "./CabinetsPage";
import SideBar from "../Navigation/SideBar";

function HomePage() {
  const user = useSelector((state) => state.user);
  const theme = useTheme();
  const links = [
    {
      name: "Search Items",
      dest: "/items",
      element: <ItemsPage />,
      icon: SearchIcon,
    },
    {
      name: "View Cabinets",
      dest: "/cabinets",
      element: <CabinetsPage />,
      icon: ViewIcon,
    },
  ];

  if (!user || user.initializing) return null;

  return user.loggedIn ? (
    <Container w={{ "2xl": theme.breakpoints["2xl"] }} maxW="100%">
      <SideBar links={links} />
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
            <CabinetsPage />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  ) : (
    <Navigate to="/login" />
  );
}

export default HomePage;

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Heading, Text, VStack } from "@chakra-ui/react";
import NavBar from "../Navigation/NavBar";
import AddHandler from "../forms/AddHandler";
import ModalCabinetForm from "../forms/ModalCabinetForm";
import ModalDrawerForm from "../forms/ModalDrawerForm";
import ModalItemForm from "../forms/ModalItemForm";
import Cabinet from "../cards/Cabinet";

function HomePage() {
  const user = useSelector((state) => state.user);
  const cabinets = useSelector((state) => state.cabinets);
  const drawers = useSelector((state) => state.drawers);
  const items = useSelector((state) => state.items);

  if (!user || user.initializing) return null;

  return user.loggedIn ? (
    <>
      <NavBar />
      <AddHandler addName="Cabinet">
        <ModalCabinetForm />
      </AddHandler>
      <AddHandler addName="Drawer">
        <ModalDrawerForm />
      </AddHandler>
      <AddHandler addName="Item">
        <ModalItemForm />
      </AddHandler>
      <Heading>Cabinets</Heading>
      {cabinets ? (
        <VStack>
          {cabinets.map((c) => (
            <Cabinet key={c.id} cabinet={c} />
          ))}
        </VStack>
      ) : (
        <Text>There are no cabinets</Text>
      )}
      {cabinets
        ? cabinets.map((c) => (
            <section key={c.id}>
              <h2>
                {c.name} {c.drawers.length}
              </h2>
              {drawers
                ? drawers
                    .filter((d) => d.cabinet === c.id)
                    .sort((a, b) => b.position - a.position)
                    .map((d) => (
                      <section key={d.id}>
                        <h3 key={d.id}>{`---${d.name} ${d.position}`}</h3>
                        {items
                          ? items
                              .filter((i) => i.drawer === d.id)
                              .sort((a, b) => (a.name < b.name ? -1 : 1))
                              .map((i) => <p key={i.id}>{`------${i.name}`}</p>)
                          : null}
                      </section>
                    ))
                : null}
            </section>
          ))
        : null}
    </>
  ) : (
    <Navigate to="/login" />
  );
}

export default HomePage;

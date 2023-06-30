import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import NavBar from "../Navigation/NavBar";
import AddHandler from "../AddHandler";
import ModalCabinetForm from "../forms/ModalCabinetForm";
import ModalDrawerForm from "../forms/ModalDrawerForm";

function HomePage() {
  const user = useSelector((state) => state.user);
  const cabinets = useSelector((state) => state.cabinets);
  const drawers = useSelector((state) => state.drawers);

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
      {cabinets
        ? cabinets.map((c) => (
            <section key={c.id}>
              <h2>
                {c.name} {c.drawers.length}
              </h2>
              {drawers
                ? drawers
                    .filter((d) => d.cabinet === c.id)
                    .sort((a, b) => a.position - b.position)
                    .map((d) => (
                      <p key={d.id}>
                        {d.name} {d.position}
                      </p>
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

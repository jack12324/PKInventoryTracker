import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import NavBar from "../Navigation/NavBar";
import AddHandler from "../AddHandler";
import ModalCabinetForm from "../forms/ModalCabinetForm";

function HomePage() {
  const user = useSelector((state) => state.user);
  const cabinets = useSelector((state) => state.cabinets);

  if (!user || user.initializing) return null;

  return user.loggedIn ? (
    <>
      <NavBar />
      <AddHandler addName="Cabinet">
        <ModalCabinetForm />
      </AddHandler>
      {cabinets
        ? cabinets.map((c) => (
            <p>
              {c.name} {c.drawers.length}
            </p>
          ))
        : null}
    </>
  ) : (
    <Navigate to="/login" />
  );
}

export default HomePage;

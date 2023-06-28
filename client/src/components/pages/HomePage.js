import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import NavBar from "../Navigation/NavBar";
import AddHandler from "../AddHandler";
import ModalCabinetForm from "../forms/ModalCabinetForm";

function HomePage() {
  const user = useSelector((state) => state.user);

  if (!user || user.initializing) return null;

  return user.loggedIn ? (
    <>
      <NavBar />
      <AddHandler addName="Cabinet">
        <ModalCabinetForm />
      </AddHandler>
    </>
  ) : (
    <Navigate to="/login" />
  );
}

export default HomePage;

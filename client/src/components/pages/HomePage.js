import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { logoutUser } from "../../reducers/userReducer";

function HomePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  if (!user || user.initializing) return null;
  const logout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return user.loggedIn ? (
    <section>
      <h1>hello {user?.username}</h1>
      <p> you are{user.admin ? " " : " not "}an admin</p>
      <button type="button" onClick={logout}>
        logout
      </button>
    </section>
  ) : (
    <Navigate to="/login" />
  );
}

export default HomePage;

import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoginPage from "./components/pages/LoginPage";
import SignupPage from "./components/pages/SignupPage";
import HomePage from "./components/pages/HomePage";
import { initializeUser, logoutUser } from "./reducers/userReducer";
import { errorToast } from "./components/alerts/Toasts";
import { clearError } from "./reducers/errorReducer";

function App() {
  const error = useSelector((state) => state.error);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(initializeUser());
  }, []);

  if (!error) return null;

  useEffect(() => {
    if (error.active && error.scope === "GENERAL") {
      errorToast(error.message);
      if (error.name === "JWT EXPIRED") {
        dispatch(logoutUser());
        navigate("/login");
      }
      dispatch(clearError());
    }
  }, [error]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;

import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import LoginPage from "./components/pages/LoginPage";
import SignupPage from "./components/pages/SignupPage";
import HomePage from "./components/pages/HomePage";
import { initializeUser } from "./reducers/userReducer";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeUser());
  }, []);
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

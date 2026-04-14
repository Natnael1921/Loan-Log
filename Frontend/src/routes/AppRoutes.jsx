import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "../pages/landing";
import Auth from "../pages/auth";
import Dashboard from "../pages/Dashboard";
const AppRoutes = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default AppRoutes;

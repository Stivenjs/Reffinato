import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../pages/login-registration/Login";
import Register from "../pages/login-registration/Register";
import ResetPassword from "../pages/password-reset/ResetPassword";
import Home from "../pages/home/Home";
function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;

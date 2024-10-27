import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/store/authStore";

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user } = useAuthStore();
  const adminUID = import.meta.env.VITE_ADMIN_UID;

  // Si no hay usuario autenticado, redirige a /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si es una ruta solo para admins y el UID no coincide, redirige a la página de inicio
  if (adminOnly && user.uid !== adminUID) {
    return <Navigate to="/" replace />;
  }

  // Si el usuario está autenticado y cumple con los permisos, renderiza el contenido de la ruta
  return <Outlet />;
};

export default ProtectedRoute;

import { auth } from "../services/credentials";
import { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithCustomToken,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../instances/axiosInstance";
import useAuthStore from "@/store/authStore";

export const useAuth = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const reloadUser = useAuthStore((state) => state.reloadUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Registrar usuario en el backend
      const response = await axiosInstance.post("/register", {
        displayName: name,
        email,
        password,
      });

      const { token, user } = response.data;

      // Iniciar sesión con el token personalizado
      const auth = getAuth();
      const userCredential = await signInWithCustomToken(auth, token);
      const firebaseUser = userCredential.user;

      // Obtener un token fresco
      const idToken = await firebaseUser.getIdToken(true);

      setUser({ ...user, ...firebaseUser, token: idToken });
      localStorage.setItem("token", idToken);

      setLoading(false);
      navigate("/");
      return { success: true };
    } catch (err) {
      console.error("Error al registrar:", err);
      setError(err.response?.data?.message || "Error durante el registro");
      setLoading(false);
      return { success: false, error: error };
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdToken();

      setUser({ ...user, token });
      localStorage.setItem("token", token);

      setLoading(false);
      return { success: true };
    } catch (err) {
      if (err instanceof Error) {
        const firebaseError = err;
        switch (firebaseError.code) {
          case "auth/user-not-found":
            setError("There is no account with this email");
            break;
          case "auth/wrong-password":
            setError("Incorrect password");
            break;
          case "auth/invalid-email":
            setError("Invalid email");
            break;
          case "auth/too-many-requests":
            setError(
              "Your account has been disabled due to too many failed login attempts."
            );
            break;
          default:
            setError("Incorrect data try again");
        }
      } else {
        setError("Unexpected error during login");
      }
      setLoading(false);
      return { success: false, error: error };
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      const auth = getAuth();
      await auth.signOut();
      clearUser();
      reloadUser();
      localStorage.removeItem("token");
      setLoading(false);
      navigate("/login");
      return { success: true };
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      setError("Error al cerrar sesión");
      setLoading(false);
      return { success: false, error: "Error al cerrar sesión" };
    }
  };

  return { register, login, logout, loading, error };
};

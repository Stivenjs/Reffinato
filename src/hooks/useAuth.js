import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/credentials";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../instances/axiosInstance";
import axios from "axios";
import useAuthStore from "@/store/authStore";

export const useAuth = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/api/auth/register", {
        displayName: name,
        email,
        password,
      });

      const { user, token } = response.data;
      setUser({ ...user, token });
      console.log("Usuario registrado:", { ...user, token });
      localStorage.setItem("token", token);

      setLoading(false);

      return { success: true };
    } catch (err) {
      console.error("Error al registrar:", err);

      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Registration error");
      } else {
        setError("Unexpected error during registration");
      }
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
      console.log("Usuario logueado:", { ...user, token });
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
    try {
      const auth = getAuth();
      await auth.signOut();
      setUser(null);
      localStorage.removeItem("token");
      setLoading(false);
      navigate("/login");
      return { success: true };
    } catch (err) {
      setError("Error al cerrar sesión");
      setLoading(false);
      return { success: false, error: "Error al cerrar sesión" };
    }
  };

  return { register, login, logout, loading, error };
};

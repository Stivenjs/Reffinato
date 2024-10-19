import { useState } from "react";
import { FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../services/credentials";
import useAuthStore from "@/store/authStore";
import axiosInstance from "../instances/axiosInstance";

export const useFacebookAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const setUser = useAuthStore((state) => state.setUser);

  const facebookProvider = new FacebookAuthProvider();

  const loginWithFacebook = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      const token = await user.getIdToken();

      // Enviar los datos al backend para almacenar el usuario en la base de datos
      await axiosInstance.post("/auth/social-login", {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        token: token,
      });

      setUser({ ...user, token });
      localStorage.setItem("token", token);

      console.log("User logged in with Facebook and sent to backend:", {
        ...user,
        token,
      });
      setLoading(false);
    } catch (err) {
      console.error("Error during Facebook sign-in:", err);
      setError("Failed to log in with Facebook");
      setLoading(false);
    }
  };

  return { loginWithFacebook, loading, error };
};

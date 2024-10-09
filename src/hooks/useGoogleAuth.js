import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { auth } from "../services/credentials";
import useAuthStore from "@/store/authStore";
export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const setUser = useAuthStore((state) => state.setUser);

  const googleProvider = new GoogleAuthProvider();

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();
      setUser({ ...user, token });
      localStorage.setItem("token", token);
      console.log("User logged in with Google:", { ...user, token });
      setLoading(false);
    } catch (err) {
      console.error("Error during Google sign-in:", err);
      setError("Failed to log in with Google");
      setLoading(false);
    }
  };

  return { loginWithGoogle, loading, error };
};

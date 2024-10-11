import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/instances/axiosInstance";
import useAuthStore from "@/store/authStore";

export const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useAuthStore();

  const updatePersonalInfo = async (firstName, lastName, phone) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put("/profile", {
        firstName,
        lastName,
        phone,
      });

      toast({
        title: "Profile Updated",
        description: response.data.message,
      });

      setUser({
        ...user,
        displayName: `${firstName} ${lastName}`,
        phone,
      });
    } catch (error) {
      console.error("Error updating personal info:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSecurityInfo = async (email, password) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put("/profile", {
        email,
        password,
      });

      toast({
        title: "Security Info Updated",
        description: response.data.message,
      });

      setUser({
        ...user,
        email,
      });
    } catch (error) {
      console.error("Error updating security info:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update security info",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    updatePersonalInfo,
    updateSecurityInfo,
    loading,
  };
};

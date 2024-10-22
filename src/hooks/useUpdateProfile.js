import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/instances/axiosInstance";
import useAuthStore from "@/store/authStore";

export const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const { user, setUser, reloadUser } = useAuthStore();

  const updateUserState = useCallback(
    (newData) => {
      setUser(newData);
      reloadUser();
    },
    [setUser, reloadUser]
  );

  const updatePersonalInfo = async (firstName, lastName, phone, photoFile) => {
    setLoading(true);

    try {
      const formData = new FormData();
      if (firstName) formData.append("firstName", firstName);
      if (lastName) formData.append("lastName", lastName);
      if (phone) formData.append("phone", phone);
      if (photoFile) formData.append("photo", photoFile);

      const response = await axiosInstance.put("/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Server response:", response.data);

      toast({
        title: "Profile Updated",
        description: response.data.message,
      });

      if (response.data.user) {
        const updatedDisplayName =
          `${firstName || ""} ${lastName || ""}`.trim() ||
          user?.displayName ||
          "";

        updateUserState({
          displayName: updatedDisplayName,
          email: response.data.user.email,
          photoURL: response.data.user.photoURL,
          phone: response.data.user.phone,
        });

        console.log(
          "Updated user state from store:",
          useAuthStore.getState().user
        );
      } else {
        console.error("User data is missing in the response.");
      }
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

      console.log("Server response:", response.data);

      toast({
        title: "Security Info Updated",
        description: response.data.message,
      });

      updateUserState({
        email: response.data.user.email,
      });

      console.log(
        "Updated user state from store:",
        useAuthStore.getState().user
      );
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

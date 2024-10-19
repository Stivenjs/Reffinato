import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import Sidebar from "./components/SideBar";
import AccountContent from "./components/AccountContent";
import MyOrders from "./components/MyOrders";
import MyAddresses from "./components/MyAdresses";
import MyWallet from "./components/MyWallet";
import MyWishlist from "./components/MyWishList";
import MySubscriptions from "./components/MySubscriptions";
import CustomAlert from "@/components/shared/CustomAlert";

export default function UpdateProfile() {
  const [searchParams] = useSearchParams();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { updatePersonalInfo, updateSecurityInfo } = useUpdateProfile();
  const [isUpdateAlertOpen, setIsUpdateAlertOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(
    searchParams.get("section") || "account"
  );
  const [formData, setFormData] = useState(null);
  const [isSecurityUpdate, setIsSecurityUpdate] = useState(false);

  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      setSelectedSection(section);
    }
  }, [searchParams]);

  const onSubmit = (data) => {
    setFormData(data);
    setIsUpdateAlertOpen(true);
    setIsSecurityUpdate(false);
  };

  const onSecuritySubmit = (data) => {
    setFormData(data);
    setIsUpdateAlertOpen(true);
    setIsSecurityUpdate(true);
  };

  const handleConfirmUpdate = async () => {
    if (formData) {
      try {
        if (isSecurityUpdate) {
          await updateSecurityInfo(formData.email, formData.newPassword);
        } else {
          await updatePersonalInfo(
            formData.firstName,
            formData.lastName,
            formData.phone
          );
        }
        reset(formData);
        setIsUpdateAlertOpen(false);
        setFormData(null);
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  const renderContent = () => {
    switch (selectedSection) {
      case "orders":
        return <MyOrders />;
      case "addresses":
        return <MyAddresses />;
      case "wallet":
        return <MyWallet />;
      case "wishlist":
        return <MyWishlist />;
      case "subscriptions":
        return <MySubscriptions />;
      default:
        return (
          <AccountContent
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            onSecuritySubmit={onSecuritySubmit}
            errors={errors}
          />
        );
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 mt-36">
      <div className="flex flex-col lg:flex-row gap-6">
        <Sidebar
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
        />
        <main className="flex-1">
          <div id={selectedSection}>{renderContent()}</div>
        </main>
      </div>
      <CustomAlert
        isOpen={isUpdateAlertOpen}
        onClose={() => setIsUpdateAlertOpen(false)}
        title={
          isSecurityUpdate
            ? "Update Security Information"
            : "Update Information"
        }
        description={
          isSecurityUpdate
            ? "Are you sure you want to update your security information? This will update your email and password in our system."
            : "Are you sure you want to update your information? This will update your personal information in our system."
        }
        onConfirm={handleConfirmUpdate}
        confirmText={isSecurityUpdate ? "Update Security" : "Update Info"}
      />
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";

export default function AccountContent({
  register,
  handleSubmit,
  onSubmit,
  onSecuritySubmit,
  errors,
}) {
  const { loading } = useUpdateProfile();
  const [securityForm, setSecurityForm] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
  });
  const [securityErrors, setSecurityErrors] = useState({
    email: "",
    newPassword: "",
    general: "",
  });

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityForm({ ...securityForm, [name]: value });

    setSecurityErrors({ ...securityErrors, [name]: "", general: "" });
  };

  const validateSecurityForm = () => {
    let isValid = true;
    const errors = { email: "", newPassword: "", general: "" };

    if (securityForm.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(securityForm.email)) {
        errors.email = "Please enter a valid email address";
        isValid = false;
      }
    }

    if (securityForm.newPassword) {
      if (securityForm.newPassword.length < 8) {
        errors.newPassword = "Password must be at least 8 characters long";
        isValid = false;
      }
    }

    if (
      securityForm.email === "" &&
      securityForm.newPassword === "" &&
      securityForm.currentPassword === ""
    ) {
      errors.general =
        "Please fill at least one field to update your security information.";
      isValid = false;
    }

    setSecurityErrors(errors);
    return isValid;
  };

  const handleSecuritySubmit = (e) => {
    e.preventDefault();

    if (validateSecurityForm()) {
      onSecuritySubmit(securityForm);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>
          View and edit your personal info below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="personal">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    {...register("firstName", {
                      required: "First name is required",
                      minLength: {
                        value: 2,
                        message: "First name must be at least 2 characters",
                      },
                      maxLength: {
                        value: 15,
                        message: "First name must not exceed 15 characters",
                      },
                    })}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    {...register("lastName", {
                      required: "Last name is required",
                      minLength: {
                        value: 2,
                        message: "Last name must be at least 2 characters",
                      },
                      maxLength: {
                        value: 15,
                        message: "Last name must not exceed 15 characters",
                      },
                    })}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                <Button type="submit" className="w-full sm:w-auto bg-[#a0501a]">
                  Update Info
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          <TabsContent value="security">
            <form className="space-y-4" onSubmit={handleSecuritySubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={securityForm.email}
                  onChange={handleSecurityChange}
                />
                {securityErrors.email && (
                  <p className="text-red-500 text-sm">{securityErrors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={securityForm.currentPassword}
                  onChange={handleSecurityChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={securityForm.newPassword}
                  onChange={handleSecurityChange}
                />
                {securityErrors.newPassword && (
                  <p className="text-red-500 text-sm">
                    {securityErrors.newPassword}
                  </p>
                )}
              </div>
              {securityErrors.general && (
                <p className="text-red-500 text-sm">{securityErrors.general}</p>
              )}
              <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-[#a0501a]"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Security"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

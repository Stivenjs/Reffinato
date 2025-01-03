import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, Package, User, Heart, Settings, Camera } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import useAuthStore from "@/store/authStore";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";

export default function Sidebar({ selectedSection, setSelectedSection }) {
  const [isHovering, setIsHovering] = useState(false);
  const { user } = useAuthStore();
  const { updatePersonalInfo } = useUpdateProfile();
  const fileInputRef = useRef(null);

  const handleAvatarChange = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await updatePersonalInfo(
          user.firstName,
          user.lastName,
          user.phone,
          file
        );
        toast({
          title: "Avatar Update",
          description: "Your profile picture has been updated.",
        });
      } catch (error) {
        console.error("Error updating avatar:", error);
        toast({
          title: "Error",
          description: "Failed to update profile picture.",
          variant: "destructive",
        });
      }
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const userInitial = user?.displayName ? getInitials(user.displayName) : "?";

  return (
    <aside className="w-full lg:w-1/4">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row lg:flex-col items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-0 lg:space-y-4">
            <div
              className="relative"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.photoURL} alt={user?.displayName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {userInitial}
                </AvatarFallback>
              </Avatar>

              {isHovering && (
                <div
                  className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center cursor-pointer"
                  onClick={handleAvatarChange}
                >
                  <Camera className="text-white" />
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="text-center sm:text-left lg:text-center">
              <CardTitle>{user.displayName}</CardTitle>
              <CardDescription>Manage your account</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <nav className="flex flex-col space-y-1">
            <Button
              variant={selectedSection === "orders" ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => setSelectedSection("orders")}
            >
              <Package className="mr-2 h-4 w-4" />
              My Orders
            </Button>
            <Button
              variant={selectedSection === "addresses" ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => setSelectedSection("addresses")}
            >
              <Home className="mr-2 h-4 w-4" />
              My Addresses
            </Button>
            <Button
              variant={selectedSection === "wishlist" ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => setSelectedSection("wishlist")}
            >
              <Heart className="mr-2 h-4 w-4" />
              My Wishlist
            </Button>
            <Button
              variant={
                selectedSection === "subscriptions" ? "secondary" : "ghost"
              }
              className="justify-start"
              onClick={() => setSelectedSection("subscriptions")}
            >
              <Settings className="mr-2 h-4 w-4" />
              My Subscriptions
            </Button>
            <Button
              variant={selectedSection === "account" ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => setSelectedSection("account")}
            >
              <User className="mr-2 h-4 w-4" />
              My Account
            </Button>
          </nav>
        </CardContent>
      </Card>
    </aside>
  );
}

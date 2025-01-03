import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useFacebookAuth } from "@/hooks/useFacebookAuth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import useAuthStore from "@/store/authStore";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { login, loading, error } = useAuth();
  const {
    loginWithGoogle,
    loading: googleLoading,
    error: googleError,
  } = useGoogleAuth();
  const {
    loginWithFacebook,
    loading: facebookLoading,
    error: facebookError,
  } = useFacebookAuth();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    console.log("Login attempt with:", data.email, data.password);
    await login(data.email, data.password);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5e5c5]">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center lg:items-stretch">
        <motion.div
          className="w-full lg:w-1/2 p-12 flex flex-col items-center justify-center"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              src="/ReffinatoLogoBrowser.webp"
              alt="Reffinato Logo"
              width={200}
              height={200}
              className="mb-8"
            />
          </motion.div>
          <motion.h1
            className="text-6xl font-bold mb-4 text-[#333]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Reffinato
          </motion.h1>
          <motion.p
            className="text-2xl mb-8 text-[#555]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Find your perfect swimwear
          </motion.p>
        </motion.div>
        <motion.div
          className="w-full lg:w-1/2 p-4"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md mx-auto bg-white/80 shadow-lg">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-[#a0501a]">
                  Log In
                </CardTitle>
                <CardDescription className="text-[#a0501a]">
                  Access your Reffinato account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email" className="text-[#a0501a]">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        {...register("email", {
                          required: "Email is required",
                        })}
                        className={`border-[#a0501a] focus:border-[#a0501a] transition-all duration-300 focus:ring focus:ring-[#4a90e2]/20 ${
                          errors.email ? "border-red-500" : ""
                        }`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="password" className="text-[#a0501a]">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        {...register("password", {
                          required: "Password is required",
                        })}
                        className={`border-[#a0501a] focus:border-[#a0501a] transition-all duration-300 focus:ring focus:ring-[#4a90e2]/20 ${
                          errors.password ? "border-red-500" : ""
                        }`}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    className="w-full bg-[#a0501a] hover:bg-[#8b4513] text-white transition-all duration-300 transform hover:scale-105 mt-4"
                    type="submit"
                    disabled={loading || isSubmitting}
                  >
                    {loading ? "Logging In..." : "Log In"}
                  </Button>
                </form>
              </CardContent>
              {error && (
                <div className="mx-6">
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </div>
              )}
              <CardFooter className="flex flex-col">
                <div className="flex justify-center space-x-4 mt-4">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2 bg-white hover:bg-gray-100"
                    onClick={loginWithGoogle}
                    disabled={googleLoading}
                  >
                    <FcGoogle className="h-5 w-5" />
                    <span>Google</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2 bg-white hover:bg-gray-100"
                    onClick={loginWithFacebook}
                    disabled={facebookLoading}
                  >
                    <FaFacebook className="h-5 w-5 text-blue-600" />
                    <span>Facebook</span>
                  </Button>
                </div>
                {googleError && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{googleError}</AlertDescription>
                  </Alert>
                )}
                {facebookError && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{facebookError}</AlertDescription>
                  </Alert>
                )}
                <p className="mt-4 text-sm text-center">
                  Don't have an account?
                  <Link
                    to="/register"
                    className="text-[#a0501a] hover:underline ml-1 transition-colors duration-200"
                  >
                    Sign up here
                  </Link>
                </p>
                <p className="mt-4 text-sm text-center">
                  Forgot your password?{" "}
                  <Link
                    to="/reset-password"
                    className="text-[#a0501a] hover:underline ml-1 transition-colors duration-200"
                  >
                    Reset it here
                  </Link>
                </p>
              </CardFooter>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

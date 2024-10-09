import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import {
  Waves,
  Sun,
  Umbrella,
  ShoppingBag,
  AlertCircle,
  Facebook,
  Mail,
} from "lucide-react";
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
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gradient-to-br from-sky-100 to-blue-200 p-4">
      <motion.div
        className="w-full lg:w-1/2 max-w-md lg:max-w-2xl p-8 text-center text-blue-700"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4">Reffinato</h1>
        <p className="text-xl mb-8">Your destination for beach fashion</p>
        <div className="flex justify-center space-x-4 mb-8">
          <Sun className="h-12 w-12 text-yellow-400 animate-pulse" />
          <Umbrella className="h-12 w-12 text-red-400 animate-bounce" />
          <Waves className="h-12 w-12 text-blue-400 animate-pulse" />
        </div>
        <ShoppingBag className="h-24 w-24 mx-auto text-blue-500" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="w-full lg:w-[400px] bg-white/80 shadow-xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-blue-600">
                Log In
              </CardTitle>
              <CardDescription className="text-blue-500">
                Access your Reffinato account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email" className="text-blue-600">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      {...register("email", { required: "Email is required" })}
                      className={`border-blue-200 focus:border-blue-400 transition-all duration-300 focus:ring focus:ring-blue-200 ${
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
                    <Label htmlFor="password" className="text-blue-600">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      {...register("password", {
                        required: "Password is required",
                      })}
                      className={`border-blue-200 focus:border-blue-400 transition-all duration-300 focus:ring focus:ring-blue-200 ${
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
                  className="w-full bg-blue-400 hover:bg-blue-500 text-white transition-all duration-300 transform hover:scale-105 mt-4"
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
                  <Mail className="h-5 w-5 text-red-500" />
                  <span>Google</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center space-x-2 bg-white hover:bg-gray-100"
                  onClick={loginWithFacebook}
                  disabled={facebookLoading}
                >
                  <Facebook className="h-5 w-5 text-blue-600" />
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
              <p className="mt-4 text-sm text-center text-blue-600">
                Don't have an account?
                <Link
                  to="/register"
                  className="text-blue-500 hover:underline ml-1 transition-colors duration-200"
                >
                  Sign up here
                </Link>
              </p>
              <p className="mt-4 text-sm text-center text-blue-600">
                Forgot your password?{" "}
                <Link
                  to="/reset-password"
                  className="text-blue-500 hover:underline ml-1 transition-colors duration-200"
                >
                  Reset it here
                </Link>
              </p>
            </CardFooter>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}

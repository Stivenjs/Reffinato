import { useState } from "react";
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
import { Sun, Umbrella, TreePalm, Shirt, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Register() {
  const {
    register: registerForm,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [registrationError, setRegistrationError] = useState(null);

  const onSubmit = async (data) => {
    const { name, email, password } = data;
    setRegistrationError(null);

    try {
      const result = await register(name, email, password);
      if (result.success) {
        navigate("/");
      } else {
        setRegistrationError(result.error || "Error en el registro");
      }
    } catch (err) {
      console.error("Error registering:", err);
      setRegistrationError(
        err.message || "Error en el registro. Por favor, inténtalo de nuevo."
      );
    }
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
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <motion.div
        className="w-full lg:w-1/2 max-w-md lg:max-w-2xl p-8 text-center text-amber-800"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4">Reffinato</h1>
        <p className="text-xl mb-8">Join our beach-loving community</p>
        <div className="flex justify-center space-x-4 mb-8">
          <Sun className="h-12 w-12 text-amber-400 animate-pulse" />
          <Umbrella className="h-12 w-12 text-rose-300 animate-bounce" />
          <TreePalm className="h-12 w-12 text-emerald-400 animate-pulse" />
        </div>
        <Shirt className="h-24 w-24 mx-auto text-amber-600" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="w-full lg:w-[400px] bg-white/90 shadow-md">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-amber-700">
                Register
              </CardTitle>
              <CardDescription className="text-amber-600">
                Create your account at Reffinato
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name" className="text-amber-700">
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      {...registerForm("name", {
                        required: "Name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters long",
                        },
                      })}
                      className="border-amber-200 focus:border-amber-400 transition-all duration-300 focus:ring focus:ring-amber-100"
                    />
                    {errors.name && (
                      <span className="text-red-500">
                        {errors.name.message}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email" className="text-amber-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      {...registerForm("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      className="border-amber-200 focus:border-amber-400 transition-all duration-300 focus:ring focus:ring-amber-100"
                    />
                    {errors.email && (
                      <span className="text-red-500">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password" className="text-amber-700">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      {...registerForm("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message:
                            "Password must be at least 6 characters long",
                        },
                      })}
                      className="border-amber-200 focus:border-amber-400 transition-all duration-300 focus:ring focus:ring-amber-100"
                    />
                    {errors.password && (
                      <span className="text-red-500">
                        {errors.password.message}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-amber-700">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...registerForm("confirmPassword", {
                        required: "Confirm your password",
                        validate: (value) =>
                          value === watch("password") ||
                          "Passwords do not match",
                      })}
                      className="border-amber-200 focus:border-amber-400 transition-all duration-300 focus:ring focus:ring-amber-100"
                    />
                    {errors.confirmPassword && (
                      <span className="text-red-500">
                        {errors.confirmPassword.message}
                      </span>
                    )}
                  </div>
                </div>
                {(error || registrationError) && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {error || registrationError}
                    </AlertDescription>
                  </Alert>
                )}
                <Button
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white transition-all duration-300 transform hover:scale-105 mt-4"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <p className="mt-4 text-sm text-center text-amber-700">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-amber-600 hover:underline ml-1 transition-colors duration-200"
                >
                  Log in here
                </Link>
              </p>
            </CardFooter>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}

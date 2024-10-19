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
import { AlertCircle } from "lucide-react";
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
            Join our beach-loving community
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
                  Register
                </CardTitle>
                <CardDescription className="text-[#a0501a]">
                  Create your account at Reffinato
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name" className="text-[#a0501a]">
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
                        className="border-[#a0501a] focus:border-[#a0501a] transition-all duration-300 focus:ring focus:ring-[#f97316]/20"
                      />
                      {errors.name && (
                        <span className="text-red-500">
                          {errors.name.message}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email" className="text-[#a0501a]">
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
                        className="border-[#a0501a] focus:border-[#a0501a] transition-all duration-300 focus:ring focus:ring-[#f97316]/20"
                      />
                      {errors.email && (
                        <span className="text-red-500">
                          {errors.email.message}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="password" className="text-[#a0501a]">
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
                        className="border-[#a0501a] focus:border-[#a0501a] transition-all duration-300 focus:ring focus:ring-[#f97316]/20"
                      />
                      {errors.password && (
                        <span className="text-red-500">
                          {errors.password.message}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-[#a0501a]"
                      >
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
                        className="border-[#a0501a] focus:border-[#a0501a] transition-all duration-300 focus:ring focus:ring-[#f97316]/20"
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
                    className="w-full bg-[#a0501a] hover:bg-[#8b4513] text-white transition-all duration-300 transform hover:scale-105 mt-4"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Register"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col">
                <p className="mt-4 text-sm text-center ">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-[#a0501a] hover:underline ml-1 transition-colors duration-200"
                  >
                    Log in here
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

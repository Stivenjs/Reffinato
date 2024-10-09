import { useState } from "react";
import { motion } from "framer-motion";
import { sendPasswordResetEmail, getAuth } from "firebase/auth";
import { auth } from "../../services/credentials";
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
import { Link } from "react-router-dom";
import { Waves, Sun, Umbrella, Lock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Instructions sent! Please check your email.");
    } catch (err) {
      console.error("Error sending reset email:", err);
      setError("Failed to send instructions. Please try again.");
    } finally {
      setLoading(false);
      setEmail("");
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
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gradient-to-br from-teal-50 to-blue-100 p-4">
      <motion.div
        className="w-full lg:w-1/2 max-w-md lg:max-w-2xl p-8 text-center text-teal-800"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4">Reffinato</h1>
        <p className="text-xl mb-8">
          Reset your password and get back to enjoying summer
        </p>
        <div className="flex justify-center space-x-4 mb-8">
          <Sun className="h-12 w-12 text-yellow-400 animate-pulse" />
          <Umbrella className="h-12 w-12 text-teal-400 animate-bounce" />
          <Waves className="h-12 w-12 text-blue-400 animate-pulse" />
        </div>
        <Lock className="h-24 w-24 mx-auto text-teal-600" />
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
              <CardTitle className="text-2xl font-bold text-teal-700">
                Reset Password
              </CardTitle>
              <CardDescription className="text-teal-600">
                Enter your email to receive instructions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email" className="text-teal-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-teal-200 focus:border-teal-400 transition-all duration-300 focus:ring focus:ring-teal-100"
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button
                className="w-full bg-teal-500 hover:bg-teal-600 text-white transition-all duration-300 transform hover:scale-105"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Instructions"}
              </Button>

              {message && (
                <Alert className="mt-4 bg-green-50 border-green-200">
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              {error && (
                <Alert className="mt-4 bg-red-50 border-red-200">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="mt-4 text-sm text-center space-y-2">
                <p className="text-teal-700">
                  Remembered your password?
                  <Link
                    to="/login"
                    className="text-teal-600 hover:underline ml-1 transition-colors duration-200"
                  >
                    Log in here
                  </Link>
                </p>
                <p className="text-teal-700">
                  Don&apos;t have an account?
                  <Link
                    to="/register"
                    className="text-teal-600 hover:underline ml-1 transition-colors duration-200"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </CardFooter>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}

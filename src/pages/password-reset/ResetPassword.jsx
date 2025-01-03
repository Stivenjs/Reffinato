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
            Reset your password.
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
                  Reset Password
                </CardTitle>
                <CardDescription className="text-[#a0501a]">
                  Enter your email to receive instructions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email" className="text-[#a0501a]">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border-[#a0501a] focus:border-[#a0501a] transition-all duration-300 focus:ring focus:ring-[#00a86b]/20"
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button
                  className="w-full bg-[#a0501a] hover:bg-[#8b4513] text-white transition-all duration-300 transform hover:scale-105"
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
                  <Alert className="mt-4" variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="mt-4 text-sm text-center space-y-2">
                  <p>
                    Remembered your password?{" "}
                    <Link
                      to="/login"
                      className="text-[#a0501a] hover:underline transition-colors duration-200"
                    >
                      Log in here
                    </Link>
                  </p>
                  <p>
                    Don&apos;t have an account?{" "}
                    <Link
                      to="/register"
                      className="text-[#a0501a] hover:underline transition-colors duration-200"
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
    </div>
  );
}

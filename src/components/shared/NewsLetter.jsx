import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Subscribed with email:", email);
      setEmail("");
      setShowConfirmation(true);
    } catch (error) {
      toast({
        title: "Error",
        description:
          "There was a problem processing your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-[#a0501a] text-white py-12 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">
          Join the Reffinato Community
        </h2>
        <p className="mb-6">
          Get up to 25% off your first order with REFFINATO GOLD
        </p>
        <form onSubmit={handleSubmit} className="flex max-w-md mx-auto mb-8">
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow mr-2 text-white"
            required
          />
          <Button
            type="submit"
            className="bg-gray-900 hover:bg-gray-800 transition-colors duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "SUBSCRIBE"}
          </Button>
        </form>
        <div>
          <h3 className="text-xl font-semibold mb-4">Follow us on:</h3>
          <div className="flex justify-center space-x-4">
            <a
              href="#"
              className="hover:text-gray-300 transition-colors duration-300"
            >
              <Facebook size={24} />
              <span className="sr-only">Facebook</span>
            </a>
            <a
              href="#"
              className="hover:text-gray-300 transition-colors duration-300"
            >
              <Instagram size={24} />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href="#"
              className="hover:text-gray-300 transition-colors duration-300"
            >
              <Youtube size={24} />
              <span className="sr-only">YouTube</span>
            </a>
          </div>
        </div>
      </div>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thank you for subscribing!</DialogTitle>
            <DialogDescription>
              You have successfully joined the Reffinato community. You will
              soon receive news and exclusive offers in your email.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowConfirmation(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </section>
  );
}

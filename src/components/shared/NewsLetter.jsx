import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg shadow-xl">
      <div className="max-w-3xl mx-auto text-center text-white">
        <h2 className="text-4xl font-bold mb-6">Join Reffinato Community</h2>
        <p className="text-xl mb-8">
          Get up to 25% OFF your first order with REFFINATO GOLD
        </p>
        <form
          onSubmit={handleEmailSubmit}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Input
            type="email"
            placeholder="Enter your email here*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white text-teal-800 placeholder-teal-400 border-none focus:ring-2 focus:ring-orange-400"
          />
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-2"
          >
            Sign Up Now
          </Button>
        </form>
      </div>
    </section>
  );
}

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Youtube } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Subscribed with email:", email);
    setEmail("");
  };

  return (
    <section className="bg-[#a0501a] text-white py-12 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Join Reffinato Community</h2>
        <p className="mb-6">
          Get up to 25% OFF your first order with REFFINATO GOLD
        </p>
        <form onSubmit={handleSubmit} className="flex max-w-md mx-auto mb-8">
          <Input
            type="email"
            placeholder="Tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow mr-2 text-white"
            required
          />
          <Button type="submit" className="bg-gray-900 hover:bg-gray-800">
            ACCEPT
          </Button>
        </form>
        <div>
          <h3 className="text-xl font-semibold mb-4">follow us:</h3>
          <div className="flex justify-center space-x-4">
            <a href="#" className="hover:text-gray-300">
              <Facebook size={24} />
              <span className="sr-only">Facebook</span>
            </a>
            <a href="#" className="hover:text-gray-300">
              <Instagram size={24} />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="#" className="hover:text-gray-300">
              <span className="sr-only">Pinterest</span>
            </a>
            <a href="#" className="hover:text-gray-300">
              <Youtube size={24} />
              <span className="sr-only">YouTube</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

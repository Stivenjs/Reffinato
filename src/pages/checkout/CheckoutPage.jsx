import { useEffect, useState } from "react";
import { Country, State } from "country-state-city";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAddresses } from "@/hooks/fetchAddresses";
import axiosInstance from "../../instances/axiosInstance";
import CustomSelect from "@/components/shared/CustomSelect";
import useAuthStore from "@/store/authStore";

const CheckoutPage = () => {
  const { register, handleSubmit, setValue, watch } = useForm();
  const { user } = useAuthStore();
  const { logout } = useAuth();

  const { data: addresses } = useAddresses(user.uid);

  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(
      allCountries.map((country) => ({
        value: country.isoCode,
        label: country.name,
      }))
    );
  }, []);

  const handleSelectChange = (name, value) => {
    setValue(name, value);
    if (name === "country") {
      const countryStates = State.getStatesOfCountry(value);
      setRegions(
        countryStates.map((state) => ({
          value: state.isoCode,
          label: state.name,
        }))
      );
    }
  };

  const handleUseDifferentAddress = () => {
    if (addresses && addresses.length > 0) {
      const selectedAddress = addresses[0];
      setValue("firstName", selectedAddress.first_name || "");
      setValue("lastName", selectedAddress.last_name || "");
      setValue("phone", selectedAddress.phone || "");
      setValue("country", selectedAddress.country || "");
      setValue("address", selectedAddress.address || "");
      setValue("city", selectedAddress.city || "");
      setValue("region", selectedAddress.region || "");
      setValue("zipCode", selectedAddress.zip_code || "");

      const countryStates = State.getStatesOfCountry(selectedAddress.country);
      setRegions(
        countryStates.map((state) => ({
          value: state.isoCode,
          label: state.name,
        }))
      );
    }
  };

  // Nueva función para manejar el pago
  const handlePayment = async () => {
    const totalAmount = 94.99; // Cambia esto según el monto total de la orden

    try {
      const response = await axiosInstance("payments/create-payment", {
        amount: totalAmount,
      });

      // Redirige al usuario a la URL de aprobación de PayPal
      const approvalUrl = response.data.payment.links.find(
        (link) => link.rel === "approval_url"
      ).href;
      window.location.href = approvalUrl;
    } catch (error) {
      console.error("Error al procesar el pago:", error);
    }
  };

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    // Aquí enviarías los datos del formulario al backend o donde los necesites
  };

  return (
    <div className="max-w-6xl mx-auto p-4 flex flex-col lg:flex-row gap-8 mt-44">
      <div className="flex-1">
        <h1 className="text-2xl font-semibold mb-4">Express checkout</h1>
        <Button
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black mb-4"
          onClick={handlePayment} // Llama a la función de pago
        >
          <img
            src="/paypal.svg"
            alt="PayPal"
            width={80}
            height={20}
            className="mr-2"
          />
          Pagar
        </Button>
        <div className="text-center mb-4">or</div>

        <div className="bg-gray-100 p-4 rounded mb-4 flex justify-between items-center">
          <span>Logged in as {user.email}</span>
          <Button
            variant="link"
            onClick={() => {
              logout();
            }}
          >
            Log out
          </Button>
        </div>

        <h2 className="text-xl font-semibold mb-4">Delivery details</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input {...register("firstName")} placeholder="First name" />
            <Input {...register("lastName")} placeholder="Last name" />
          </div>
          <Input {...register("phone")} placeholder="Phone" />
          <CustomSelect
            options={countries}
            placeholder="Country/Region"
            onChange={(option) => handleSelectChange("country", option.value)}
            value={watch("country")}
          />
          <Input {...register("address")} placeholder="Address" />
          <Input {...register("city")} placeholder="City" />
          <CustomSelect
            options={regions}
            placeholder="Region"
            onChange={(option) => handleSelectChange("region", option.value)}
            value={watch("region")}
          />
          <Input {...register("zipCode")} placeholder="Zip / Postal code" />
          <div className="flex items-center space-x-2">
            <Checkbox id="saveAddress" />
            <label
              htmlFor="saveAddress"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Save this address
            </label>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleUseDifferentAddress}
            >
              Use a Different Address
            </Button>
            <Button type="submit" className="flex-1">
              Continue
            </Button>
          </div>
        </form>
      </div>
      <div className="w-full lg:w-80">
        <h2 className="text-xl font-semibold mb-4">Order summary (1)</h2>
        <Link to="/cart">
          <Button variant="link" className="mb-4">
            Edit Cart
          </Button>
        </Link>
        <div className="flex gap-4 border-b pb-4 mb-4">
          <img
            src="/placeholder.svg?height=80&width=80"
            alt="Blu Marino shorts"
            width={80}
            height={80}
            className="object-cover"
          />
          <div>
            <h3 className="font-semibold">Blu Marino</h3>
            <p className="text-sm text-gray-600">$94.99</p>
            <p className="text-sm text-gray-600">Qty: 1</p>
          </div>
        </div>
        <Button variant="link" className="mb-4">
          Enter a promo code
        </Button>
        <div className="space-y-2 border-b pb-4 mb-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>$94.99</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>$0.00</span>
          </div>
        </div>
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>$94.99</span>
        </div>
        <div className="flex items-center justify-center mt-4 text-sm text-gray-600">
          <Lock className="w-4 h-4 mr-1" /> Secure Checkout
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

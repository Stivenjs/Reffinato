import React, { useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  User,
  Building,
  MapPin,
  Flag,
  Globe,
  MapPinned,
  Phone,
  Home,
  ChevronDown,
} from "lucide-react";
import { PiCity } from "react-icons/pi";
import { Country, State } from "country-state-city";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAddresses } from "@/hooks/fetchAddresses";
import useAuthStore from "@/store/authStore";
import useSendData from "@/hooks/useSendData";

const CustomSelect = ({ options, value, onChange, placeholder, disabled }) => {
  return (
    <div className="relative">
      <select
        className="w-full p-2 pr-8 border border-gray-300 rounded-md appearance-none bg-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
    </div>
  );
};

const CountryRegionSelector = ({ control, watch, setValue }) => {
  const watchCountry = watch("country");

  const countryOptions = useMemo(
    () =>
      Country.getAllCountries().map((country) => ({
        value: country.isoCode,
        label: country.name,
      })),
    []
  );

  const regionOptions = useMemo(() => {
    if (!watchCountry) return [];
    return State.getStatesOfCountry(watchCountry).map((state) => ({
      value: state.isoCode,
      label: state.name,
    }));
  }, [watchCountry]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Controller
          name="country"
          control={control}
          rules={{ required: "Country is required" }}
          render={({ field }) => (
            <CustomSelect
              options={countryOptions}
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                setValue("region", "");
              }}
              placeholder="Select a country"
            />
          )}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="region">Region</Label>
        <Controller
          name="region"
          control={control}
          render={({ field }) => (
            <CustomSelect
              options={regionOptions}
              value={field.value}
              onChange={field.onChange}
              placeholder="Select a region"
              disabled={!watchCountry || regionOptions.length === 0}
            />
          )}
        />
      </div>
    </div>
  );
};

export default function MyAddresses() {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuthStore();
  const { sendData, editData, loading, error } = useSendData();
  const { data: addresses, isLoading, isError } = useAddresses(user?.uid);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      companyName: "",
      address: "",
      addressLine2: "",
      city: "",
      country: "",
      region: "",
      zipCode: "",
      phone: "",
      isDefault: false,
    },
  });

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const address = addresses[0];
      reset({
        firstName: address.first_name,
        lastName: address.last_name,
        companyName: address.company_name,
        address: address.address,
        addressLine2: address.address_line_2,
        city: address.city,
        country: address.country,
        region: address.region,
        zipCode: address.zip_code,
        phone: address.phone,
        isDefault: address.is_default,
      });
    }
  }, [addresses, reset]);

  const onSubmit = async (data) => {
    console.log("Form submitted with data:", data);
    let response;
    if (addresses && addresses.length > 0) {
      response = await editData(addresses[0].id, data);
    } else {
      response = await sendData(data);
    }
    if (response && !error) {
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Name</Label>
          <Controller
            name="firstName"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field }) => <Input id="firstName" {...field} />}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Controller
            name="lastName"
            control={control}
            rules={{ required: "Last name is required" }}
            render={({ field }) => <Input id="lastName" {...field} />}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyName">Company name</Label>
        <Controller
          name="companyName"
          control={control}
          rules={{ required: "Company name is required" }}
          render={({ field }) => <Input id="companyName" {...field} />}
        />
        {errors.companyName && (
          <p className="text-sm text-red-500">{errors.companyName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Controller
          name="address"
          control={control}
          rules={{ required: "Address is required" }}
          render={({ field }) => <Input id="address" {...field} />}
        />
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="addressLine2">Line 2 address</Label>
        <Controller
          name="addressLine2"
          control={control}
          render={({ field }) => <Input id="addressLine2" {...field} />}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Controller
          name="city"
          control={control}
          rules={{ required: "City is required" }}
          render={({ field }) => <Input id="city" {...field} />}
        />
        {errors.city && (
          <p className="text-sm text-red-500">{errors.city.message}</p>
        )}
      </div>

      <CountryRegionSelector
        control={control}
        watch={watch}
        setValue={setValue}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip code</Label>
          <Controller
            name="zipCode"
            control={control}
            rules={{ required: "Zip code is required" }}
            render={({ field }) => <Input id="zipCode" {...field} />}
          />
          {errors.zipCode && (
            <p className="text-sm text-red-500">{errors.zipCode.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Controller
            name="phone"
            control={control}
            rules={{ required: "Phone is required" }}
            render={({ field }) => <Input id="phone" {...field} />}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Controller
          name="isDefault"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="isDefault"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="isDefault">Make this my default address</Label>
      </div>

      <Button type="submit" className="w-full bg-[#a0501a]" disabled={loading}>
        {loading
          ? "Submitting..."
          : addresses && addresses.length > 0
          ? "Update Address"
          : "Add Address"}
      </Button>
    </form>
  );

  const renderAddress = (address) => (
    <Card className="w-full max-w-md justify-between">
      <CardContent className="space-y-4 pt-6">
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <p>
            <strong>Name:</strong> {address[0].first_name}{" "}
            {address[0].last_name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Building className="w-5 h-5" />
          <p>
            <strong>Company:</strong> {address[0].company_name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5" />
          <p>
            <strong>Address:</strong> {address[0].address}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5" />
          <p>
            <strong>Line 2 address:</strong> {address[0].address_line_2}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <PiCity className="w-5 h-5" />
          <p>
            <strong>City:</strong> {address[0].city}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Flag className="w-5 h-5" />
          <p>
            <strong>Country:</strong>{" "}
            {Country.getCountryByCode(address[0].country)?.name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5" />
          <p>
            <strong>Region:</strong>{" "}
            {
              State.getStateByCodeAndCountry(
                address[0].region,
                address[0].country
              )?.name
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <MapPinned className="w-5 h-5" />
          <p>
            <strong>Zip Code:</strong> {address[0].zip_code}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-5 h-5" />
          <p>
            <strong>Phone:</strong> {address[0].phone}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Home className="w-5 h-5" />
          <p>
            <strong>Default Address:</strong>{" "}
            {address[0].is_default ? "Yes" : "No"}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleEdit}
          className="w-full bg-[#a0501a] hover:bg-[#8b4513]"
        >
          Edit Address
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Addresses</CardTitle>
        <CardDescription>
          {addresses && addresses.length > 0 && !isEditing
            ? "View and manage your addresses."
            : "Add and manage the addresses you use often."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <p className="text-sm text-red-500 mb-4">
            An error occurred: {error.message}
          </p>
        )}
        {addresses && addresses.length > 0 && !isEditing
          ? renderAddress(addresses)
          : renderForm()}
      </CardContent>
    </Card>
  );
}

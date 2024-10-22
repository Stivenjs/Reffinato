import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload } from "lucide-react";
import CustomSelect from "@/components/shared/CustomSelect";
import useAddProduct from "@/hooks/useAddProduct";
import SideBar from "../../components/shared/SideBar";

export default function AdminProductForm() {
  const [product, setProduct] = useState({
    name: "",
    color: "",
    price: "",
    sizes: [],
    description: "",
    details: "",
    photos: [],
    category: "",
  });
  const [newSize, setNewSize] = useState("");
  const fileInputRef = useRef(null);
  const { addProduct, loading } = useAddProduct(); // Usa el hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSize = () => {
    if (newSize && !product.sizes.includes(newSize)) {
      setProduct((prev) => ({ ...prev, sizes: [...prev.sizes, newSize] }));
      setNewSize("");
    }
  };

  const handleRemoveSize = (sizeToRemove) => {
    setProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((size) => size !== sizeToRemove),
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = e.target.files;
    if (files && files.length > 0 && product.photos.length < 3) {
      const newPhotos = Array.from(files).slice(0, 3 - product.photos.length);
      setProduct((prev) => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos],
      }));
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = (photoToRemove) => {
    setProduct((prev) => ({
      ...prev,
      photos: prev.photos.filter((photo) => photo !== photoToRemove),
    }));
  };

  const handleCategoryChange = (value) => {
    setProduct((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addProduct(product); // Llama al hook para agregar el producto

    // Resetea el formulario
    setProduct({
      name: "",
      color: "",
      price: "",
      sizes: [],
      description: "",
      details: "",
      photos: [],
      category: "",
    });
  };

  const categoryOptions = [
    { value: "Bikini", label: "Bikini" },
    { value: "Swimsuits", label: "Swimsuits" },
    { value: "Beachwear", label: "Beachwear" },
  ];

  return (
    <div className="flex">
    <SideBar/>
      <div className="max-w-2xl mx-auto mt-32 w-[80%] pb-6">
        <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              name="color"
              value={product.color}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <CustomSelect
              options={categoryOptions}
              placeholder="Select a category"
              onChange={handleCategoryChange}
              value={product.category}
              name="category"
            />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={product.price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="size">Sizes</Label>
            <div className="flex space-x-2">
              <Input
                id="size"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="Add size"
              />
              <Button type="button" onClick={handleAddSize}>
                Add
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <span
                  key={size}
                  className="bg-primary text-primary-foreground px-2 py-1 rounded-full flex items-center"
                >
                  {size}
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(size)}
                    className="ml-2 text-primary-foreground hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="photos">Product Photos (maximum 3)</Label>
            <div className="mt-2">
              <Input
                id="photos"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                multiple
                ref={fileInputRef}
                className="hidden"
              />
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={product.photos.length >= 3}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photos
              </Button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {product.photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(photo)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="details">Details</Label>
            <Textarea
              id="details"
              name="details"
              value={product.details}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
          </Button>
        </form>
      </div>
    </div>
  );
}

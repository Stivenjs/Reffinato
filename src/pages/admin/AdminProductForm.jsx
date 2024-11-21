import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomSelect from "@/components/shared/CustomSelect";
import useAddProduct from "@/hooks/useAddProduct";
import SideBar from "@/components/shared/SideBar";

export default function AdminProductForm() {
  const [product, setProduct] = useState({
    name: "",
    colors: [],
    price: "",
    sizes: [],
    description: "",
    details: "",
    photos: [],
    category: "",
  });
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const fileInputRef = useRef(null);
  const { addProduct, loading } = useAddProduct();

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

  const handleAddColor = () => {
    if (newColor && !product.colors.includes(newColor)) {
      setProduct((prev) => ({ ...prev, colors: [...prev.colors, newColor] }));
      setNewColor("");
    }
  };

  const handleRemoveSize = (sizeToRemove) => {
    setProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((size) => size !== sizeToRemove),
    }));
  };

  const handleRemoveColor = (colorToRemove) => {
    setProduct((prev) => ({
      ...prev,
      colors: prev.colors.filter((color) => color !== colorToRemove),
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newPhotos = Array.from(files);
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
    await addProduct(product);
    setProduct({
      name: "",
      colors: [],
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
    <div className="flex ">
      <SideBar />
      <div className="flex-1 p-8 mt-24">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <CustomSelect
                  options={categoryOptions}
                  placeholder="Select category"
                  onChange={handleCategoryChange}
                  value={product.category}
                  name="category"
                />
              </div>

              <div className="space-y-2">
                <Label>Colors</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="Add colors"
                  />
                  <Button
                    className="bg-[#a0501a] hover:bg-[#8b4513]"
                    type="button"
                    onClick={handleAddColor}
                    size="icon"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.colors.map((color) => (
                    <span
                      key={color}
                      className="bg-primary text-primary-foreground px-2 py-1 rounded-full flex items-center text-sm"
                    >
                      {color}
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(color)}
                        className="ml-2 text-primary-foreground hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Sizes</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder="Add size"
                  />
                  <Button
                    className="bg-[#a0501a] hover:bg-[#8b4513]"
                    type="button"
                    onClick={handleAddSize}
                    size="icon"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.sizes.map((size) => (
                    <span
                      key={size}
                      className="bg-primary text-primary-foreground px-2 py-1 rounded-full flex items-center text-sm"
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

              <div className="space-y-2">
                <Label htmlFor="photos">Product Photos</Label>
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
                    className="bg-[#a0501a] hover:bg-[#8b4513]"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
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

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="details">Details</Label>
                <Textarea
                  id="details"
                  name="details"
                  value={product.details}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#a0501a] hover:bg-[#8b4513]"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Product"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  Autocomplete,
  Button,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext"; // Update this path if needed
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const cloudName = "dbqf9udic"; // ✅ Replace with your actual Cloudinary name
const uploadPreset = "ecommerce_unsigned";

const SellProductForm = () => {
  const initialState = {
    title: "",
    brand: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    featured: false,
    images: [],
    thumbnail: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [imagePreview, setImagePreview] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreview(previews);

    const uploadedUrls = [];

    for (const file of files) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", uploadPreset);
      data.append("cloud_name", cloudName);

      try {
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          data
        );
        uploadedUrls.push(res.data.secure_url);
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Failed to upload image");
      }
    }

    setFormData((prev) => ({ ...prev, images: uploadedUrls }));
    setUploading(false);
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setThumbnailPreview(URL.createObjectURL(file));
    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);
    data.append("cloud_name", cloudName);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        data
      );
      setFormData((prev) => ({ ...prev, thumbnail: res.data.secure_url }));
    } catch (error) {
      console.error("Thumbnail upload failed:", error);
      toast.error("Failed to upload thumbnail");
    }

    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.thumbnail) return toast.warning("Please upload a thumbnail.");
    if (formData.images.length === 0)
      return toast.warning("Please upload product images.");

    try {
      const res = await axios.post("https://e-app-delta.vercel.app/products", {
        ...formData,
        sellerId: user._id,
      });

      if (res.status === 201 || res.status === 200) {
        toast.success("Product created successfully!");
        setFormData(initialState);
        setImagePreview([]);
        setThumbnailPreview("");
      } else {
        toast.error("Failed to create product.");
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  const categories = ["Shoes", "Shirts", "Pants", "Accessories"];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Sell Your Product
      </h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Brand"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Stock"
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
          fullWidth
          required
        />

        <Autocomplete
          freeSolo
          options={categories}
          value={formData.category}
          onChange={(e, newVal) =>
            setFormData((prev) => ({ ...prev, category: newVal.toLowerCase() || "" }))
          }
          onInputChange={(e, val) =>
            setFormData((prev) => ({ ...prev, category: val.toLocaleLowerCase() }))            
          }
          renderInput={(params) => (
            <TextField {...params} label="Category" required fullWidth />
          )}
        />

        <FormControlLabel
          control={
            <Switch
              checked={formData.featured}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  featured: e.target.checked,
                }))
              }
              color="primary"
            />
          }
          label="Featured Product?"
        />

        {/* Thumbnail Upload */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Upload Thumbnail
          </label>

          <div className="relative w-full border-2 border-dashed border-gray-300 p-4 rounded-lg text-center cursor-pointer hover:border-blue-500 transition">
            <span className="text-gray-500">
              Click to upload product thumbnail
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailUpload}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="Thumbnail preview"
              className="w-24 h-24 mt-3 rounded object-cover border"
            />
          )}
        </div>

        {/* Description */}
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
          className="md:col-span-2"
          required
        />

        {/* Product Images Upload */}
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Upload Product Images
          </label>

          <div className="relative w-full border-2 border-dashed border-gray-300 p-4 rounded-lg text-center cursor-pointer hover:border-blue-500 transition">
            <span className="text-gray-500">
              Click to upload product images
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            {imagePreview.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Preview ${idx}`}
                className="w-24 h-24 rounded object-cover border"
              />
            ))}
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end mt-4">
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={loading || uploading}
            sx={{
              borderRadius: 2,
              paddingX: 4,
              paddingY: 1,
              backgroundColor: "#2563EB",
              "&:hover": {
                backgroundColor: "#1D4ED8",
              },
            }}
          >
            {uploading ? "Uploading..." : "Submit Product"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SellProductForm;

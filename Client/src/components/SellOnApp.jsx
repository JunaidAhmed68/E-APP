import React, { useContext, useEffect, useState } from "react";
import {
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const initialState = {
  title: "",
  description: "",
  price: "",
  stock: "",
  brand: "",
  category: "",
  thumbnail: "",
  images: [],
};

const categories = ["beauty", "electronics", "clothing", "shoes", "toys"];

const SellOnApp = () => {
  const [formData, setFormData] = useState(initialState);
  const [imagePreview, setImagePreview] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) return <div className="p-4">Loading user...</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreview(previews);

    const uploadedUrls = [];

    for (const file of files) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "ecommerce_unsigned");
      data.append("cloud_name", "dbqf9udic");

      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dbqf9udic/image/upload",
          data
        );
        uploadedUrls.push(res.data.secure_url);
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Failed to upload image");
      }
    }

    setFormData((prev) => ({ ...prev, images: uploadedUrls }));
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    const preview = URL.createObjectURL(file);
    setThumbnailPreview(preview);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "ecommerce_unsigned");
    data.append("cloud_name", "dbqf9udic");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dbqf9udic/image/upload",
        data
      );
      setFormData((prev) => ({ ...prev, thumbnail: res.data.secure_url }));
    } catch (error) {
      console.error("Thumbnail upload failed:", error);
      toast.error("Failed to upload thumbnail");
    }
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Sell Your Product</h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <TextField label="Title" name="title" value={formData.title} onChange={handleChange} fullWidth required />
        <TextField label="Brand" name="brand" value={formData.brand} onChange={handleChange} fullWidth required />
        <TextField label="Price" name="price" type="number" value={formData.price} onChange={handleChange} fullWidth required />
        <TextField label="Stock" name="stock" type="number" value={formData.stock} onChange={handleChange} fullWidth required />

        <Autocomplete
          freeSolo
          options={categories}
          value={formData.category}
          onChange={(event, newValue) => {
            setFormData((prev) => ({ ...prev, category: newValue || "" }));
          }}
          onInputChange={(event, newInputValue) => {
            setFormData((prev) => ({ ...prev, category: newInputValue }));
          }}
          renderInput={(params) => <TextField {...params} label="Category" required fullWidth />}
        />

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Upload Thumbnail
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {thumbnailPreview && (
            <img src={thumbnailPreview} alt="Thumbnail preview" className="w-24 h-24 mt-3 rounded object-cover border" />
          )}
        </div>

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

        <div className="md:col-span-2">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Upload Product Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <div className="flex flex-wrap gap-4 mt-4">
            {imagePreview.map((img, idx) => (
              <img key={idx} src={img} alt={`Preview ${idx}`} className="w-24 h-24 rounded object-cover border" />
            ))}
          </div>
        </div>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="md:col-span-2 mt-4"
          sx={{ borderRadius: 2 }}
        >
          Submit Product
        </Button>
      </form>
    </div>
  );
};

export default SellOnApp;

// src/pages/Home.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCart } from "../context/CartContext";
import HeroSlider from "../components/HeroSlider";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@mui/material";
import { ProductContext } from "../context/ProductContext.jsx";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FaInstagram, FaLinkedin, FaGithub, FaPhone } from "react-icons/fa";
import axios from "axios"; // ✅ Add this

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const { setCategorySelected } = useContext(ProductContext);
  const [featured, setFeatured] = useState([]);
  const { addToCart } = useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    if (!user) return navigate("/login");
    addToCart({ ...product, quantity: 1 });
    toast.success("Added to cart");
  };

  const handleBuyNow = (product) => {
    if (!user) return navigate("/login");
    navigate("/checkout", {
      state: { buyNowProduct: { ...product, quantity: 1 } },
    });
  };
useEffect(() => {
  const fetchFeatured = async () => {
    try {
      const res = await axios.get("http://localhost:3000/products?featured=true");
      setFeatured(res.data.products || []);
    } catch (err) {
      console.error("Error fetching featured products:", err);
    }
  };
  fetchFeatured();
}, []);



useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3000/products/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };
  fetchCategories();
}, []);


  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-black text-white pb-10 px-6 md:px-12 text-center">
        <HeroSlider />
        <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-4">
          Welcome to MyApp
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Discover the latest styles. Shop the best shoes and accessories today.
        </p>
        <Link
          to="/products"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded text-lg transition"
        >
          Shop Now
        </Link>
      </section>

      {/* Categories Section */}
      <section className="py-14 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
          Shop by Category
        </h2>

        <div className="flex flex-wrap gap-3 justify-center">
          {visibleCategories.map((category, index) => (
            <span
              key={index}
              className="px-4 py-2 rounded-full cursor-pointer bg-gray-200 hover:bg-orange-500 hover:text-white transition"
              onClick={() => {
                setCategorySelected(category.name || category);
              }}
            >
              <Link to={`/products`}>{category.name || category}</Link>
            </span>
          ))}
        </div>

        <div className="text-center mt-4">
          <IconButton onClick={() => setShowAllCategories(!showAllCategories)}>
            {showAllCategories ? (
              <ChevronUpIcon className="h-5 w-5 text-blue-500" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-blue-500" />
            )}
          </IconButton>
        </div>
      </section>

      {/* Featured Products (dummy or real) */}
      <section className="py-14 px-6 bg-white max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold">
            Featured Products
          </h2>
          <Link
            to="/products"
            className="text-blue-600 hover:underline font-medium"
          >
            View All
          </Link>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg overflow-hidden hover:shadow-md transition bg-white flex flex-col"
            >
              <Link to={`/products/${product._id}`}>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
              </Link>

              <div className="p-4 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{product.title}</h3>
                  <p className="text-sm text-gray-500 mb-2 capitalize">
                    {product.category}
                  </p>
                  <span className="text-lg font-bold text-green-600">
                    ${product.price}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      handleAddToCart(product);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => {
                      handleBuyNow(product);
                    }}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-3 rounded text-sm transition"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter or Footer CTA */}
      <footer className="bg-gray-900 text-white pt-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h4 className="text-lg font-semibold mb-4">About Us</h4>
            <p className="text-sm text-gray-400">
              We bring you the latest trends in fashion, lifestyle, and everyday
              essentials — quality guaranteed, comfort assured.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>
                <Link to="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Coming Soon / Placeholder Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              Exciting Things Coming
            </h4>
            <p className="text-sm text-gray-400">
              We’re working on something amazing. Mobile app launching soon.
              Stay tuned!
            </p>
            <div className="mt-4 flex items-center space-x-2">
              <span className="bg-gray-700 text-white text-xs px-3 py-1 rounded-full">
                Android
              </span>
              <span className="bg-gray-700 text-white text-xs px-3 py-1 rounded-full">
                iOS
              </span>
              <span className="bg-gray-700 text-white text-xs px-3 py-1 rounded-full">
                Web
              </span>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4 text-gray-400 text-xl">
              <a
                href="https://www.instagram.com/_junaid9?igsh=dXl1bnA5MHB2YWF6"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.linkedin.com/in/junaid-ahmed-0081a9348/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://github.com/JunaidAhmed68"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <FaGithub />
              </a>
              <a href="tel:03190373532" className="hover:text-white">
                <FaPhone />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 py-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} MyApp. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Loader from "./Loader.jsx";
import ProductCard from "./Product_Card.jsx";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { ProductContext } from "../context/ProductContext.jsx";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link, Navigate, useNavigate } from "react-router-dom";

function Products() {
  const [categories, setCategories] = useState(["All"]);
  const [productSearch, setProductSearch] = useState("");

  const { categorySelected, setCategorySelected } = useContext(ProductContext);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [products, setProducts] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const loading = loadingProducts || loadingCategories;
  function fetchAllProducts() {
    setProducts(savedProducts);
  }
  async function justFetchOneTime() {
    try {
      const res = await axios.get("https://e-app-delta.vercel.app/products");
      setSavedProducts(res.data.products);
      if (categorySelected === "All") {
        setProducts(res.data.products);
      }
      console.log("Fetched all products:", res.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoadingProducts(false); // ✅
    }
  }

  async function fetchAllCategories() {
    try {
      const res = await axios.get(
        "https://e-app-delta.vercel.app/products/categories"
      );
      setCategories(["All", ...res.data]);
      console.log("Fetched categories:", res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false); // ✅
    }
  }

  async function fetchProductsByCategory(category) {
    try {
      const res = await axios.get(
        `https://e-app-delta.vercel.app/products/category/${category}`
      );
      setProducts(res.data.products);
      setCategorySelected(category);
      console.log(
        `Fetched products for category "${category}"`,
        res.data.products
      );
    } catch (error) {
      console.error(
        `Error fetching products for category "${category}"`,
        error
      );
    }
  }

  useEffect(() => {
    if (categorySelected === "All") {
      fetchAllProducts();
    } else {
      fetchProductsByCategory(categorySelected);
    }
  }, [categorySelected]);

  useEffect(() => {
    console.log("Category selected:", categorySelected);
    justFetchOneTime();
    fetchAllCategories();
  }, []);
  useEffect(() => {
    const search = productSearch.trim().toLowerCase();

    if (search === "") {
      setCategorySelected("All"); // Optional: Reset selected category
      setProducts(savedProducts); // ✅ Show all products
      return;
    }

    let filtered = savedProducts.filter((product) =>
      product.title.toLowerCase().includes(search)
    );
    console.log("Filtered products by title:", filtered);
    if (filtered.length === 0) {
      filtered = savedProducts.filter((product) =>
        product.description.toLowerCase().includes(search)
      );
      console.log("Filtered products by description:", filtered);
    }
    setProducts(filtered);

    if (filtered.length === 0) {
      filtered = savedProducts.filter(
        (product) => product.category.toLowerCase() == search
      );
      if (filtered.length > 0) {
        setCategorySelected(search); // Set category if found
      } else {
        setCategorySelected("All"); // Reset category if not found
      }
      console.log("Filtered products by category:", filtered);
    }
  }, [productSearch, savedProducts]);

  // useEffect(() => {
  //   if (products.length > 0 || categorySelected !== "") {
  //     setLoading(false);
  //   }
  // }, [products, categorySelected]);

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <Loader />
  //     </div>
  //   );
  // }
  if (loading) {
    return (
      <div className="p-5 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Loading Products...</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white p-4 rounded shadow space-y-2">
              <Skeleton height={160} />
              <Skeleton width={`80%`} />
              <Skeleton width={`60%`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-310 flex justify-self-center">
      <div className="p-5 w-full">
        <h2 className="text-3xl mt-4 justify-self-start mb-2">Categories</h2>

        <div className="relative mb-4">
          <div
            className={`flex flex-wrap gap-3 overflow-hidden transition-all duration-300 pt-2 ${
              showAllCategories ? "max-h-[1000px]" : "max-h-[100px]"
            }`}
          >
            {categories.map((category, index) => (
              <span
                key={index}
                className={`px-4 py-2 rounded-full cursor-pointer hover:outline-2 hover:outline-orange-400 ${
                  category === categorySelected
                    ? "bg-orange-400 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => {
                  setProductSearch("");
                  setCategorySelected(category);
                }}
              >
                {category}
              </span>
            ))}
          </div>

          <div className="text-right mt-2">
            <IconButton
              onClick={() => setShowAllCategories(!showAllCategories)}
            >
              {showAllCategories ? (
                <ChevronUpIcon className="h-5 w-5 text-blue-500" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-blue-500" />
              )}
            </IconButton>
          </div>
        </div>

        <div className="w-full sm:max-w-md mb-8">
          <TextField
            variant="outlined"
            placeholder="Search products by title, description, or category"
            className="w-full max-w-xs bg-white rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition duration-200"
            value={productSearch}
            onChange={(e) => {
              const value = e.target.value;
              setProductSearch(value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton onClick={() => setProductSearch(productSearch)}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>

        <h2 className="text-3xl mb-4 justify-self-start capitalize">
          {categorySelected} products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.length === 0 ? (
            <h2 className="col-span-full text-center text-gray-500">
              No items found for this product
            </h2>
          ) : (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;

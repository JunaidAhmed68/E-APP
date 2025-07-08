import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Loader from "./Loader.jsx";
import ProductCard from "./Product_Card.jsx";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { ProductContext } from "../context/ProductContext.jsx";

function Products() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(["All"]);
  const [productSearch, setProductSearch] = useState("");

  const { categorySelected, setCategorySelected } = useContext(ProductContext);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [products, setProducts] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);

  function fetchAllProducts() {
    setProducts(savedProducts);
  }

  async function justFetchOneTime() {
    try {
      const res = await axios.get("https://e-app-delta.vercel.app/products");
      setSavedProducts(res.data.products);
      setProducts(res.data.products);
      console.log("Fetched all products:", res.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  async function fetchAllCategories() {
    try {
      const res = await axios.get("https://e-app-delta.vercel.app/products/categories");
      setCategories(["All", ...res.data]);
      console.log("Fetched categories:", res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  async function fetchProductsByCategory(category) {
    try {
      const res = await axios.get(`https://e-app-delta.vercel.app/products/category/${category}`);
      setProducts(res.data.products);
      console.log(`Fetched products for category "${category}"`, res.data.products);
    } catch (error) {
      console.error(`Error fetching products for category "${category}"`, error);
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
    justFetchOneTime();
    fetchAllCategories();
  }, []);

  useEffect(() => {
    if (products.length > 0 || categorySelected !== "") {
      setLoading(false);
    }
  }, [products, categorySelected]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
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
                  (category.name || category) === categorySelected
                    ? "bg-orange-400 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => {
                  setProductSearch("");
                  setCategorySelected(category.name || category);
                }}
              >
                {category.name || category}
              </span>
            ))}
          </div>

          <div className="text-right mt-2">
            <IconButton onClick={() => setShowAllCategories(!showAllCategories)}>
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
            placeholder="Search products"
            className="w-full max-w-xs bg-white rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition duration-200"
            value={productSearch}
            onChange={(e) => {
              const value = e.target.value;
              setProductSearch(value);
              setCategorySelected(value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton onClick={() => setCategorySelected(productSearch)}>
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

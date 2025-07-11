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

function Products() {
  const [categories, setCategories] = useState(["All"]);
  const [productSearch, setProductSearch] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [products, setProducts] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const { categorySelected, setCategorySelected } = useContext(ProductContext);
  const loading = loadingProducts || loadingCategories;

  async function justFetchOneTime() {
    try {
      const res = await axios.get("https://e-app-delta.vercel.app/products");
      setSavedProducts(res.data.products);
      if (categorySelected === "All") setProducts(res.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoadingProducts(false);
    }
  }

  async function fetchAllCategories() {
    try {
      const res = await axios.get(
        "https://e-app-delta.vercel.app/products/categories"
      );
      setCategories(["All", ...res.data]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  }

  function fetchAllProducts() {
    setProducts(savedProducts);
  }

  async function fetchProductsByCategory(category) {
    try {
      const res = await axios.get(
        `https://e-app-delta.vercel.app/products/category/${category}`
      );
      setProducts(res.data.products);
      setCategorySelected(category);
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
    justFetchOneTime();
    fetchAllCategories();
  }, []);

  useEffect(() => {
    const search = productSearch.trim().toLowerCase();
    if (search === "") {
      setCategorySelected("All");
      setProducts(savedProducts);
      return;
    }

    let filtered = savedProducts.filter((product) =>
      product.title.toLowerCase().includes(search)
    );

    if (filtered.length === 0) {
      filtered = savedProducts.filter((product) =>
        product.description.toLowerCase().includes(search)
      );
    }

    if (filtered.length === 0) {
      filtered = savedProducts.filter(
        (product) => product.category.toLowerCase() === search
      );

      if (filtered.length > 0) {
        setCategorySelected(search);
      } else {
        setCategorySelected("All");
      }
    }

    setProducts(filtered);
  }, [productSearch, savedProducts]);

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
    <div className="p-5 flex max-w-310 mx-auto">
      <div className="p-5 w-full">
        <h2 className="text-3xl mt-4 mb-2">Categories</h2>

        {/* Categories */}
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

          {/* Toggle Expand/Collapse */}
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

        {/* Search Input */}
        <div className="w-full sm:max-w-md mb-8">
          <TextField
            variant="outlined"
            placeholder="Search products by title, description, or category"
            className="w-full max-w-xs bg-white rounded-xl shadow-sm"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>

        <h2 className="text-3xl mb-4 capitalize">
          {categorySelected} products
        </h2>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 min-h-[300px]">
          {products.length <1? (
            <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 flex items-center justify-center h-24">
              <h2 className="text-gray-500 text-xl">
                No items found for this product
              </h2>
            </div>
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

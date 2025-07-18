import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Loader from "./Loader.jsx";
import ProductCard from "./Product_Card.jsx";
import {
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { ProductContext } from "../context/ProductContext.jsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion, AnimatePresence } from "framer-motion";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PRODUCTS_PER_PAGE = 12;

  const [anchorEl, setAnchorEl] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    title: true,
    description: false,
    category: false,
  });

  const open = Boolean(anchorEl);
  const handleFilterClick = (event) => setAnchorEl(event.currentTarget);
  const handleFilterClose = () => setAnchorEl(null);
  const handleFilterChange = (option) => {
    setFilterOptions((prev) => ({ ...prev, [option]: !prev[option] }));
  };

  async function justFetchOneTime(page = 1) {
    try {
      const res = await axios.get(
        `http://localhost:3000/products?page=${page}&limit=${PRODUCTS_PER_PAGE}`
      );
      setSavedProducts(res.data.products);
      if (categorySelected === "All") setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoadingProducts(false);
    }
  }

  async function fetchAllCategories() {
    try {
      const res = await axios.get("https://e-app-delta.vercel.app/products/categories");
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
        `http://localhost:3000/products/category/${category}`
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
    if (categorySelected === "All") fetchAllProducts();
    else fetchProductsByCategory(categorySelected);
  }, [categorySelected]);

  useEffect(() => {
    justFetchOneTime(currentPage);
    fetchAllCategories();
  }, [currentPage]);

  useEffect(() => {
    const search = productSearch.trim().toLowerCase();

    const timeout = setTimeout(() => {
      if (search === "") {
        if (categorySelected === "All") setProducts(savedProducts);
        else {
          fetchProductsByCategory(categorySelected);
        }
        return;
      }

      let filtered = [];

      if (filterOptions.title) {
        filtered = filtered.concat(
          savedProducts.filter((product) =>
            product.title.toLowerCase().includes(search)
          )
        );
      }

      if (filterOptions.description) {
        filtered = filtered.concat(
          savedProducts.filter((product) =>
            product.description.toLowerCase().includes(search)
          )
        );
      }

      if (filterOptions.category) {
        filtered = filtered.concat(
          savedProducts.filter((product) =>
            product.category.toLowerCase().includes(search)
          )
        );
      }

      const uniqueFiltered = Array.from(
        new Set(filtered.map((p) => p._id))
      ).map((id) => filtered.find((p) => p._id === id));

      setProducts(uniqueFiltered);
    }, 500);

    return () => clearTimeout(timeout);
  }, [productSearch, savedProducts, filterOptions]);

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

        <div className="relative mb-4">
          <motion.div
            layout
            className={`flex flex-wrap gap-3 overflow-hidden transition-all duration-300 pt-2 ${
              showAllCategories ? "max-h-[1000px]" : "max-h-[100px]"
            }`}
          >
            {categories.map((category, index) => (
              <motion.span
                key={index}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-2 rounded-full cursor-pointer transition duration-200 hover:outline-2 hover:outline-orange-400 ${
                  category === categorySelected
                    ? "bg-orange-400 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => {
                  setProductSearch("");
                  setCategorySelected(category);
                  setCurrentPage(1);
                }}
              >
                {category}
              </motion.span>
            ))}
          </motion.div>

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

        <div className="w-full sm:max-w-md mb-8 flex items-center gap-2">
          <TextField
            variant="outlined"
            placeholder="Search..."
            className="w-full bg-white rounded-xl shadow-sm"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Tooltip title="Filter Options">
            <IconButton
              onClick={handleFilterClick}
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
                "&:hover": {
                  backgroundColor: "#f1f1f1",
                },
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleFilterClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {["title", "description", "category"].map((opt) => (
              <MenuItem key={opt} onClick={() => handleFilterChange(opt)}>
                <FormControlLabel
                  control={<Checkbox checked={filterOptions[opt]} />}
                  label={`By ${opt.charAt(0).toUpperCase() + opt.slice(1)}`}
                />
              </MenuItem>
            ))}
          </Menu>
        </div>

        <h2 className="text-3xl mb-4 capitalize">
          {categorySelected} products
        </h2>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 min-h-[300px]"
        >
          {products.length == 0 ? (
            <motion.div
              className="col-span-full flex items-center justify-center h-24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-gray-500 text-xl">
                No items found for this product
              </h2>
            </motion.div>
          ) : (
            <AnimatePresence>
              {products.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>
        <div className="flex justify-center mt-8">
          <button
            onClick={() => {
              if (currentPage > 1 && !loading) {
                setCurrentPage(currentPage - 1);
                justFetchOneTime(currentPage - 1);
              }
            }}
            disabled={currentPage === 1 || loading}
            className="px-3 py-2 mx-1 rounded bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!loading) {
                  setCurrentPage(index + 1);
                  justFetchOneTime(index + 1);
                }
              }}
              disabled={loading}
              className={`px-4 py-2 mx-1 rounded transition-colors duration-200 ${
                currentPage === index + 1
                  ? "bg-orange-400 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => {
              if (currentPage < totalPages && !loading) {
                setCurrentPage(currentPage + 1);
                justFetchOneTime(currentPage + 1);
              }
            }}
            disabled={currentPage === totalPages || loading}
            className="px-3 py-2 mx-1 rounded bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Products;

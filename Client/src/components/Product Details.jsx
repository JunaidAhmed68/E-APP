import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import ProductImageSlider from "./ProductImageSlider";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Button } from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [sliderOpen, setSliderOpen] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://e-app-delta.vercel.app/products/${id}`);
        setProduct(res.data.product);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader />
      </div>
    );
  }

  const checkUser = () => {
    if (!user) {
      navigate("/login");
      return false;
    }
    return true;
  };

  const handleBuyNow = () => {
    if (!checkUser()) return;
    navigate("/checkout", {
      state: {
        buyNowItem: {
          ...product,
          quantity,
        },
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Main Image */}
        <div className="flex flex-col items-center">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full max-w-md rounded-xl shadow-md object-cover"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
          <p className="text-gray-700 text-lg mb-4">{product.description}</p>
          <p className="text-2xl font-semibold text-green-600 mb-2">
            ${product.price}
          </p>

          <div className="space-y-1 text-gray-600 text-sm">
            <p><span className="font-medium text-black">Category:</span> {product.category}</p>
            <p><span className="font-medium text-black">Brand:</span> {product.brand}</p>
            <p><span className="font-medium text-black">Rating:</span> {product.rating} ⭐</p>
            <p><span className="font-medium text-black">In Stock:</span> {product.stock} items</p>
          </div>

          <div>
            <span>Quantity:</span>
            <button
              className="px-2 py-1 m-3 bg-gray-200 hover:bg-gray-300 rounded"
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              disabled={quantity <= 1}
            >
              −
            </button>
            <span className="font-medium">{quantity > 0 ? quantity : 1}</span>
            <button
              className="px-2 py-1 m-3 bg-gray-200 hover:bg-gray-300 rounded"
              onClick={() =>
                quantity < product.stock && setQuantity(quantity + 1)
              }
              disabled={quantity >= product.stock}
            >
              +
            </button>
          </div>

          <div className="mt-6 flex gap-4">
            <Button
              sx={{ color: "white", borderRadius: 2 }}
              variant="contained"
              color="primary"
              startIcon={<ShoppingCartIcon />}
              onClick={() => {
                if (!checkUser()) return;
                addToCart({ ...product, quantity });
                setQuantity(1);
                toast.success("Product added to cart!");
              }}
            >
              Add to cart
            </Button>

            <Button
              sx={{ color: "white", borderRadius: 2 }}
              variant="contained"
              color="secondary"
              startIcon={<ShoppingBagIcon />}
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>

      {/* Gallery Images */}
      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-4">Gallery</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {product.images?.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${product.title} ${index + 1}`}
              className="w-full h-40 object-cover rounded-lg shadow-sm cursor-pointer hover:scale-105 transition-transform"
              onClick={() => {
                setSliderIndex(index);
                setSliderOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* Image Slider Modal */}
      <ProductImageSlider
        images={product.images}
        startIndex={sliderIndex}
        open={sliderOpen}
        onClose={() => setSliderOpen(false)}
      />
    </div>
  );
}

export default ProductDetail;

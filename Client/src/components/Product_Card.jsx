import { useState } from "react";
import Loader from "./Loader.jsx";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <Link to={`/products/${product._id}`}>
      <div
        className="border p-4 hover:outline-2 hover:outline-orange-400 flex flex-col justify-between h-[350px]
             transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg rounded"
      >
        {isImageLoading && (
          <div className="flex justify-center items-center h-40">
            <Loader />
          </div>
        )}

        <img
          src={product.thumbnail || product.images?.[0]}
          alt={product.title}
          className={`w-full h-48 object-cover rounded ${
            isImageLoading ? "hidden" : "block"
          }`}
          onLoad={() => setIsImageLoading(false)}
          onError={() => {
            setIsImageLoading(false);
            console.error("Failed to load image");
          }}
        />

        <div className="mt-4 flex flex-col justify-between flex-grow">
          <h2 className="text-lg font-semibold line-clamp-2">
            {product.title}
          </h2>
          <p className="text-base font-bold mt-2 text-gray-800">
            ${product.price}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;

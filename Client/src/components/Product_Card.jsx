import { useState } from "react";
import Loader from "./Loader.jsx";
import { Link } from "react-router-dom";


function ProductCard({ product }) {
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <Link to={`/products/${product._id}`}>
   
   
    <div className="border p-4   hover:outline-2 hover:outline-orange-400  " >
      {isImageLoading && (
        <div className="flex justify-center items-center h-40">
          <Loader />
        </div>
      )}
      <img
        src={product.thumbnail || product.images?.[0]}
        alt={product.title}
        className={`w-full h-auto ${isImageLoading ? 'hidden' : 'block'}`}
        onLoad={() => setIsImageLoading(false)}
        onError={() => {
          setIsImageLoading(false);
          console.error("Failed to load image");
        }}
      />
      <h2 className="text-xl font-bold mt-2">{product.title}</h2>
      <p className="text-lg font-semibold">${product.price}</p>
    </div>
    </Link>

  );
}

export default ProductCard;

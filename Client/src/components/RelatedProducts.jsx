// components/RelatedProducts.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import ProductCard from "./Product_Card"; // or your reusable product card
import { ProductContext } from "../context/ProductContext.jsx";

function RelatedProducts({ category, currentId }) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await axios.get(
          `https://e-app-delta.vercel.app/products/category/${category}`
        );
        const filtered = res.data.products
          .filter((p) => p._id !== currentId)
          .slice(0, 4); // Exclude current product
        setRelated(filtered);
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [category, currentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader />
      </div>
    );
  }

  if (related.length === 0) {
    return <p className="text-gray-500">No related products found.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {related.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

export default RelatedProducts;

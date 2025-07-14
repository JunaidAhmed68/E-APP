import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Loader from "./Loader";

const MyCart = () => {
  const { user, loading } = useContext(AuthContext);
  const { cartItems, addToCart, removeFromCart, clearCart, decreaseFromCart } =
    useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <motion.h2
        className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🛒 My Cart
      </motion.h2>

      {cartItems.length === 0 ? (
        <motion.p
          className="text-center text-gray-500 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Your cart is empty.
        </motion.p>
      ) : (
        <>
          <AnimatePresence>
            <div className="space-y-5">
              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="grid sm:grid-cols-[1fr_auto_auto] items-center bg-white p-4 rounded-2xl shadow-md border border-gray-200 gap-6"
                >
                  {/* Image + Info */}
                  <div className="flex items-center gap-4">
                    <img
                      src={item.thumbnail || item.images?.[0]}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-xl border"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">
                        {item.title}
                      </h3>
                      <p className="text-gray-500">${item.price.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                      onClick={() => decreaseFromCart(item._id)}
                    >
                      −
                    </button>
                    <motion.span
                      key={item.quantity}
                      className="text-lg font-medium text-gray-700"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {item.quantity}
                    </motion.span>
                    <button
                      className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                      onClick={() => addToCart(item)}
                    >
                      +
                    </button>
                  </div>

                  {/* Total + Remove */}
                  <div className="flex flex-col sm:items-end sm:justify-center gap-2 text-right">
                    <p className="text-lg font-bold text-green-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700 text-sm underline"
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          {/* Total & Actions */}
          <motion.div
            layout
            className="mt-10 border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-2xl font-bold text-gray-800">
              Total: ${totalPrice.toFixed(2)}
            </h4>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                onClick={clearCart}
              >
                Clear Cart
              </button>
              <button
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                onClick={() => navigate("/checkout")}
              >
                Checkout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default MyCart;

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const MyCart = () => {
  const { user, loading } = useContext(AuthContext);
  const { cartItems, addToCart, removeFromCart, clearCart, decreaseFromCart } =
    useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) return <div className="p-4">Loading user...</div>;

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">🛒 My Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between bg-white p-4 rounded shadow-sm border"
              >
                {/* Thumbnail + Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.thumbnail || item.images?.[0]}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-gray-500">${item.price.toFixed(2)}</p>
                  </div>
                </div>

                {/* Quantity Control */}
                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                    onClick={() => decreaseFromCart(item._id)}
                  >
                    −
                  </button>
                  <span className="font-medium">{item.quantity}</span>
                  <button
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                    onClick={() => addToCart(item)}
                  >
                    +
                  </button>
                </div>

                {/* Total + Cancel */}
                <div className="flex items-center gap-4">
                  <p className="font-semibold text-lg">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-700 text-sm underline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="mt-8 border-t pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h4 className="text-2xl font-bold">
              Total: ${totalPrice.toFixed(2)}
            </h4>
            <div className="flex gap-4">
              <button
                className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={clearCart}
              >
                Clear Cart
              </button>
              <button
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => {
                  // Redirect or handle checkout logic
                  navigate("/checkout"); // 🔁 Create this route or handle payment modal
                }}
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyCart;

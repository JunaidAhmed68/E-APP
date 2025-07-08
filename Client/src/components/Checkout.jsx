import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import axios from "axios";

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const buyNowItem = location.state?.buyNowItem || null;
  const [address, setAddress] = useState("");
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const itemsToCheckout = buyNowItem ? [buyNowItem] : cartItems;

  const total = itemsToCheckout.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

 const handlePlaceOrder = async () => {
  if (!address.trim()) return alert("Please enter your address");

  const itemsToCheckout = (buyNowItem ? [buyNowItem] : cartItems).map((item) => ({
    _id: item._id,
    title: item.title,
    price: item.price,
    quantity: item.quantity || 1,
    thumbnail: item.thumbnail,
  }));

  const total = itemsToCheckout.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = {
    userId: user._id,
    items: itemsToCheckout,
    total,
    address,
  };

  console.log("📦 Order sending:", order);

  try {
    const res = await axios.post("http://localhost:3000/orders", order);

    if (res.status === 201) {
      if (!buyNowItem) clearCart();
      navigate("/orders");
    } else {
      alert("Something went wrong while placing order.");
    }
  } catch (error) {
    console.error("Order submission error:", error);
    alert(error.response?.data?.message || "Server error");
  }
};



  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Shipping Address</label>
        <textarea
          className="w-full p-3 border rounded"
          rows={4}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <h4 className="text-xl font-semibold mb-2">Order Summary</h4>
        <ul>
          {itemsToCheckout.map((item) => (
            <li key={item._id}>
              {item.title} × {item.quantity} = $
              {(item.quantity * item.price).toFixed(2)}
            </li>
          ))}
        </ul>
        <p className="mt-2 font-bold">Total: ${total.toFixed(2)}</p>
      </div>

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handlePlaceOrder}
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;

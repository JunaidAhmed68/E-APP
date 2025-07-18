import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { toast } from "react-toastify";

const Checkout = () => {
  const { user, setRelod , relod } = useContext(AuthContext);
  const { cartItems, clearCart } = useCart();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const buyNowItem = location.state?.buyNowItem || null;

  useEffect(() => {
    if (!user) navigate("/login");
    if (user?.orderAddress) setAddress(user.orderAddress);
    if (user?.orderPhone) setPhoneNumber(user.orderPhone);
  }, [user, navigate]);

  const itemsToCheckout = buyNowItem ? [buyNowItem] : cartItems;

  const total = itemsToCheckout.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!address.trim()) return alert("Please enter your address");
    if (!/^03[0-9]{9}$/.test(phoneNumber)) {
      return alert(
        "Invalid phone number format (Must start with 03 and be 11 digits)"
      );
    }

    const preparedOrder = {
      userId: user._id,
      phoneNumber,
      total,
      address,
      items: itemsToCheckout.map((item) => ({
        productId: item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        thumbnail: item.thumbnail,
      })),
    };

    try {
      const res = await axios.post("https://e-app-delta.vercel.app/orders", preparedOrder);

      if (res.status === 201) {
        if (!buyNowItem) clearCart(); // Clear cart only for cart-based orders
        toast.success("Order placed sucessfully")
        navigate("/orders");

      }
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error(error.response?.data?.message || "Server error");
    }
    finally{
      setRelod(!relod)
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
        <label className="block font-medium mb-1">Phone Number</label>
        <input
          type="tel"
          placeholder="e.g., 03XXXXXXXXX"
          className="w-full p-3 border rounded"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <h4 className="text-xl font-semibold mb-1">Payment Method</h4>
        <p className="text-gray-600">
          Currently, only cash on delivery is supported.
        </p>
      </div>

      <div className="mb-4">
        <h4 className="text-xl font-semibold mb-2">Order Summary</h4>
        <ul className="text-gray-700">
          {itemsToCheckout.map((item) => (
            <li key={item._id}>
              {item.title} × {item.quantity} = $
              {(item.price * item.quantity).toFixed(2)}
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

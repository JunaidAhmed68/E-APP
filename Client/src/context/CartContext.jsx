import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// 1️⃣ Create Context
const CartContext = createContext();

// 2️⃣ Custom hook to use CartContext
export const useCart = () => useContext(CartContext);

// 3️⃣ CartProvider component
export const CartProvider = ({ children, user }) => {
  const [cartItems, setCartItems] = useState([]);

  // 🔁 Load cart when user logs in
  useEffect(() => {
    if (user?._id) {
      axios
        .get(`https://e-app-delta.vercel.app/cart/${user._id}`)
        .then((res) => setCartItems(res.data.cart || []))
        .catch((err) => console.error("Error loading cart:", err));
    }
  }, [user]);

  // 💾 Save cart when cartItems change
  useEffect(() => {
    if (user?._id) {
      axios
        .put(`https://e-app-delta.vercel.app/cart/${user._id}`, {
          cart: cartItems,
        })
        .catch((err) => console.error("Error saving cart:", err));
    }
  }, [cartItems]);

  // ➕ Add to cart
  const addToCart = (item) => {
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i._id === item._id);
      if (existingItem) {
        return prev.map((i) =>
          i._id === item._id
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        );
      } else {
        return [...prev, { ...item, quantity: item.quantity || 1 }];
      }
    });
  };


  // ➖ Decrease quantity by 1 (remove if 0)
  const decreaseFromCart = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // ❌ Remove item entirely
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  // 🧹 Clear full cart (e.g., on checkout/logout)
  const clearCart = () => {
    setCartItems([]);
  };

  // 🔄 Reset cart on logout
  useEffect(() => {
    if (!user?._id) {
      setCartItems([]);
    }
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        decreaseFromCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

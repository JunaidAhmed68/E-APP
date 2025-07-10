import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import About from "./components/About.jsx";
import Contact from "./components/Contact.jsx";
import MyCart from "./components/My cart.jsx";
import Products from "./components/Products.jsx";
import NotFound from "./components/NotFound.jsx";
import ProductDetail from "./components/Product Details.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
import SellOnApp from "./components/SellOnApp.jsx";
import Checkout from "./components/Checkout.jsx";
import Orders from "./components/Orders.jsx";
import App from "./App.jsx";
function App_Routes() {
  const [user, setUser] = useState(true);
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="mycart" element={<MyCart />} />
        <Route path="products" element={<Products />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="contact" element={<Contact />} />
        <Route path="forgotpassword" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="sell-on-app" element={<SellOnApp />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="orders" element={<Orders />} />

      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App_Routes;

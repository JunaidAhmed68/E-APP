import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App_Routes from "./routes.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "./context/AuthContext.jsx"; // ✅ correct path
import ProductContextProvider from "./context/ProductContext.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



createRoot(document.getElementById("root")).render(
  
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <ProductContextProvider>
          <App_Routes />
          </ProductContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);

import { ToastContainer } from "react-toastify";
import Header from "./components/Header.jsx";
import { Outlet } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";
function App() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <CartProvider user={user}>
        <Header />
        <main>
          <Outlet />
          <ToastContainer />
        </main>
      </CartProvider>
    </>
  );
}


export default App;

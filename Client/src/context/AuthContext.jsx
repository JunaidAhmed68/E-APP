import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true); // loading flag

  const token = Cookies.get("token");

 useEffect(() => {
    const fetchUser = async () => {
      try {
        if (token) {
          const response = await axios.get("http://localhost:3000/auth/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setLoading(false);
          setUser(response.data.data);
          console.log("User data fetched:", response.data);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        Cookies.remove("token"); 
        setUser(null); 
      }
    };

    fetchUser();
  }, []);
  



 const logout = () => {
    Cookies.remove("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout , loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

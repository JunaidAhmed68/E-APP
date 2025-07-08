import React, { createContext, useState, useEffect } from "react";
export const ProductContext = createContext();

const ProductContextProvider = ({ children }) => {
  const [categorySelected, setCategorySelected] = useState("All");


  return (
    <ProductContext.Provider value={{ categorySelected, setCategorySelected }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContextProvider;

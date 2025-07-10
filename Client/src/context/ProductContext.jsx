import React, { createContext, useState, useEffect } from "react";
export const ProductContext = createContext();

const ProductContextProvider = ({ children }) => {
  const [categorySelected, setCategorySelected] = useState("All");

 const changeCategory = (category) => {
    setCategorySelected(category);
  }

  return (
    <ProductContext.Provider value={{ categorySelected, setCategorySelected, changeCategory }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContextProvider;

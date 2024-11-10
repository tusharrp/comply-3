import React, { createContext, useContext, useState, useEffect } from 'react';

const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // Initialize items with some test data
  useEffect(() => {
    const initialItems = [];
    setItems(initialItems);
  }, []);

  const addItem = (newSection, newText) => {
    setItems((prevItems) => [...prevItems, { section: newSection, text: newText }]);
    console.log(items);
  };

  return (
    <ItemsContext.Provider value={{ items, setItems, addItem }}>
      {children}
    </ItemsContext.Provider>
  );
};

// Custom hook to use the items context
export const useItems = () => useContext(ItemsContext);

"use client";

import { StoreContext } from "@/context/StoreContext";
import { useContext } from "react";

// Create a custom hook to use the AxiosContext
const useStore = () => {
  const context = useContext(StoreContext);
  if (context === null) {
    throw new Error("use context must be used within a StoreContextProvider");
  }
  return context;
};

export default useStore;

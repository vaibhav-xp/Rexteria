"use client";

import { AxiosContext } from "@/context/AxiosContext";
import { useContext } from "react";

// Create a custom hook to use the AxiosContext
const useAxios = () => {
  const context = useContext(AxiosContext);
  if (context === null) {
    throw new Error("use context must be used within a AxiosContextProvider");
  }
  return context;
};

export default useAxios;

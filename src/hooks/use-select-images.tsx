"use client";

import { SelectImagesContext } from "@/context/SelectImageContext";
import { useContext } from "react";

// Create a custom hook to use the SelectImagesContextProvider
const useSelectImages = () => {
  const context = useContext(SelectImagesContext);
  if (context === null) {
    throw new Error(
      "useSelectImages must be used within a SelectImagesContextProvider",
    );
  }
  return context;
};

export default useSelectImages;

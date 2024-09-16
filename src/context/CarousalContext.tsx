"use client";

import { ReactNode, useState, createContext } from "react";

// Create the context
export const CarousalContext = createContext<{
  images: string[] | null;
  handleSetImages: (images: string[]) => void;
  handleRemoveImages: () => void;
} | null>(null);

// Create the CarousalContextProvider component
export default function CarousalContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [images, setImages] = useState<string[] | null>(null);

  // Function to set images
  const handleSetImages = (images: string[]) => {
    setImages(images);
  };

  // Function to remove images
  const handleRemoveImages = () => {
    setImages(null);
  };

  // Value to be provided to the context consumers
  const value = {
    images,
    handleSetImages,
    handleRemoveImages,
  };

  return (
    <CarousalContext.Provider value={value}>
      {children}
    </CarousalContext.Provider>
  );
}

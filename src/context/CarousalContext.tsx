"use client";

import { ReactNode, useState, createContext, useCallback } from "react";

export const CarousalContext = createContext<{
  images: string[] | null;
  handleSetImages: (images: string[], index?: number) => void;
  handleRemoveImages: () => void;
} | null>(null);

export default function CarousalContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [images, setImages] = useState<string[] | null>(null);

  const handleSetImages = useCallback((images: string[], index?: number) => {
    if (index !== undefined) {
      const selectedOne = images.find((_, idx) => index === idx);
      setImages((prev) => [selectedOne as string, ...(prev || [])]);
    } else {
      setImages(images);
    }
  }, []);

  const handleRemoveImages = useCallback(() => {
    setImages(null);
  }, []);

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

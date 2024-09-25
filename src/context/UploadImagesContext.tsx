"use client";

import { createContext, ReactNode, useState } from "react";

interface UploadImagesContextTypes {
  open: boolean;
  handleOpenUploadImages: () => void;
  handleCloseUploadImages: () => void;
  handleSetRefetch: (fn: () => void) => void;
  refetch: (() => void) | null;
}

export const UploadImagesContext = createContext<
  UploadImagesContextTypes | undefined
>(undefined);

export default function UploadImagesContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<(() => void) | null>(null);

  const handleOpenUploadImages = () => {
    setOpen(true);
  };

  const handleCloseUploadImages = () => {
    setOpen(false);
    setRefetch(null);
  };

  const handleSetRefetch = (fn: () => void) => {
    setRefetch(() => fn);
  };

  return (
    <UploadImagesContext.Provider
      value={{
        open,
        handleOpenUploadImages,
        handleCloseUploadImages,
        handleSetRefetch,
        refetch,
      }}
    >
      {children}
    </UploadImagesContext.Provider>
  );
}

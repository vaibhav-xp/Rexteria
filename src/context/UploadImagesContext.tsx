"use client";

import { createContext, ReactNode, useState, useCallback } from "react";

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

  const handleOpenUploadImages = useCallback(() => {
    setOpen(true);
  }, []);

  const handleCloseUploadImages = useCallback(() => {
    setOpen(false);
    setRefetch(null);
  }, []);

  const handleSetRefetch = useCallback((fn: () => void) => {
    setRefetch(() => fn);
  }, []);

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

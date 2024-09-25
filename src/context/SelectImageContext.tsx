"use client";

import { ImageTypeWithID } from "@/types/image-types";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

interface SelectImagesContextTypes {
  selectedImages: ImageTypeWithID[];
  setSelectedImages: Dispatch<SetStateAction<ImageTypeWithID[]>>;
  handleSelectedImages: (image: ImageTypeWithID) => void;
  handleDeleteAllSelectedImages: () => void;
  handelDeleteSingleSelectedImages: (image: ImageTypeWithID) => void;
  selectDialogOpen: number;
  setSelectDialogOpen: Dispatch<SetStateAction<number>>;
  handleDialogClose: () => void;
}

export const SelectImagesContext =
  createContext<SelectImagesContextTypes | null>(null);

const SelectImageContextProvider = ({ children }: { children: ReactNode }) => {
  const [selectDialogOpen, setSelectDialogOpen] = useState<number>(0);
  const [selectedImages, setSelectedImages] = useState<ImageTypeWithID[]>([]);

  const handleSelectedImages = (image: ImageTypeWithID) => {
    setSelectedImages((prev) => [...prev, image]);
  };

  const handleDeleteAllSelectedImages = () => {
    setSelectedImages([]);
  };

  const handelDeleteSingleSelectedImages = (image: ImageTypeWithID) => {
    setSelectedImages((prev) => {
      const newImages = prev.filter((img) => img.public_id !== image.public_id);
      return newImages;
    });
  };

  const handleDialogClose = () => {
    setSelectDialogOpen(0);
  };

  return (
    <SelectImagesContext.Provider
      value={{
        selectedImages,
        setSelectedImages,
        setSelectDialogOpen,
        handleSelectedImages,
        handleDeleteAllSelectedImages,
        handelDeleteSingleSelectedImages,
        selectDialogOpen,
        handleDialogClose,
      }}
    >
      {children}
    </SelectImagesContext.Provider>
  );
};

export default SelectImageContextProvider;

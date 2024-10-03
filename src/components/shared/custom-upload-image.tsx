"use client";

import useCarousal from "@/hooks/use-carousal";
import useUploadImages from "@/hooks/use-upload-images";
import { showAlert } from "@/services/handle-api";
import { postGalleryFn } from "@/services/gallery";
import { Minus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";

export default function UploadImages() {
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const { open, handleCloseUploadImages, refetch } = useUploadImages();
  const { handleSetImages } = useCarousal();

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);
      setFiles([...fileArray, ...files]);

      const imageUrls = fileArray.map((file) => URL.createObjectURL(file));
      setImages([...imageUrls, ...images]);
    }
  };

  // Handle image removal
  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, idx) => idx !== index);
    setImages(updatedImages);
  };

  const uploadImages = async () => {
    setLoading(true);
    const formData = new FormData();
    files.forEach((file, idx) => formData.append(`images[${idx}]`, file));
    postGalleryFn(formData)
      .then((data) => showAlert(data))
      .then(() => {
        setFiles([]);
        setImages([]);
        if (refetch) refetch();
        handleCloseUploadImages();
      })
      .finally(() => setLoading(false));
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseUploadImages}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Images</DialogTitle>
          <DialogDescription>
            Select multiple images to upload
          </DialogDescription>
        </DialogHeader>

        {/* File Input */}
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />

        {/* Render selected images */}
        {images.length > 0 && (
          <div className="mt-4 max-h-[500px] overflow-y-scroll">
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative w-full aspect-square overflow-hidden rounded-lg cursor-pointer group"
                >
                  <Image
                    src={img}
                    alt={`Selected image ${index}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:grayscale"
                    onClick={() => handleSetImages(images, index)}
                  />
                  <div className="absolute top-1 right-1 transition-transform duration-200">
                    <div
                      className="hidden group-hover:flex items-center justify-center w-6 h-6 bg-red-900 rounded-md transition-opacity duration-300 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(index);
                      }}
                    >
                      <Minus className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          {images?.length > 0 && (
            <Button
              variant={"destructive"}
              onClick={() => {
                setFiles([]);
                setImages([]);
              }}
            >
              Clear
            </Button>
          )}
          <Button
            type="submit"
            onClick={uploadImages}
            disabled={files.length === 0}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

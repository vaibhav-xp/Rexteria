"use client";

import useCarousal from "@/hooks/use-carousal";
import useSelectImages from "@/hooks/use-select-images";
import useStore from "@/hooks/use-store";
import useUploadImages from "@/hooks/use-upload-images";
import { deleteGalleryFn, getGalleryFn } from "@/services/gallery";
import { showAlert } from "@/services/handle-api";
import { ImageTypeWithID } from "@/types/image-types";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Minus, Upload } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import LoadingSpinner from "./loading-spinner";
import NotFound from "./not-found";

export default function SelectedImages() {
  const [loading, setLoading] = useState<boolean>(false);
  const [images, setImages] = useState<ImageTypeWithID[]>([]);
  const [onlyFirstTime, setOnlyFirstTime] = useState(true);
  const { user } = useStore();
  const {
    selectDialogOpen,
    handleDialogClose,
    handleSelectedImages,
    selectedImages,
    handelDeleteSingleSelectedImages,
  } = useSelectImages();
  const { handleSetImages } = useCarousal();
  const { handleOpenUploadImages, handleSetRefetch } = useUploadImages();

  const getGalleries = useCallback(() => {
    setLoading(true);
    getGalleryFn()
      .then((data) => {
        setImages(data?.data || []);
      })
      .catch((error) => {
        console.error("Error fetching gallery images:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (user && user?.role === "ADMIN" && onlyFirstTime) {
      getGalleries();
      setOnlyFirstTime(false);
    }
  }, [getGalleries, user, onlyFirstTime]);

  const viewImages = useMemo(() => images.map((img) => img.url), [images]);

  const handleViewImages = (index: number) => {
    handleSetImages(viewImages as string[], index);
  };

  const handleDelete = async (imagesToDelete: ImageTypeWithID[]) => {
    const formData = new FormData();
    imagesToDelete.forEach((img) =>
      formData.append(`image[]`, img.public_id as string),
    );

    const data = await deleteGalleryFn(formData);
    showAlert(data);
    getGalleries();
  };

  const handleCheckboxChange = (
    checked: CheckedState,
    img: ImageTypeWithID,
  ) => {
    if (checked) {
      if (selectedImages.length < selectDialogOpen) handleSelectedImages(img);
    } else {
      handelDeleteSingleSelectedImages(img);
    }
  };

  return (
    <Dialog open={!!selectDialogOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-[800px] w-full p-4">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className="text-xl">Select Images</DialogTitle>
              <DialogDescription>
                Choose images from your gallery or upload new ones.
              </DialogDescription>
            </div>
            <Button
              variant="outline"
              className="flex justify-center gap-2 items-center mr-6"
              onClick={() => {
                handleSetRefetch(getGalleries);
                handleOpenUploadImages();
              }}
            >
              <Upload className="w-4 h-4 " /> Upload Images
            </Button>
          </div>
        </DialogHeader>

        <div className="mt-4">
          {selectedImages.length > 0 && (
            <Carousel className="mb-6">
              <CarouselContent>
                {selectedImages.map((img, idx) => (
                  <CarouselItem
                    className="basis-1/2 lg:basis-1/4"
                    key={img?._id}
                  >
                    <div
                      key={img?._id}
                      className="relative w-full aspect-square overflow-hidden rounded-lg cursor-pointer group"
                    >
                      <Image
                        src={img?.url as string}
                        alt={`Selected image ${img?._id}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:grayscale"
                        onClick={() =>
                          handleSetImages(
                            selectedImages.map((s) => s?.url) as string[],
                            idx,
                          )
                        }
                      />
                      <div className="absolute top-1 right-1">
                        <div
                          className="hidden group-hover:flex items-center justify-center w-6 h-6 bg-red-900 rounded-md transition-opacity duration-300 cursor-pointer"
                          onClick={() => handelDeleteSingleSelectedImages(img)}
                        >
                          <Cross1Icon className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <h4 className="text-xl mb-4">Gallery Images</h4>
              {images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-4 max-h-[500px] overflow-y-scroll">
                  {images.map((img: ImageTypeWithID) => (
                    <div
                      key={img?._id}
                      className="relative w-full aspect-square overflow-hidden rounded-lg cursor-pointer group shadow-sm hover:shadow-lg"
                    >
                      <Image
                        src={img?.url as string}
                        alt={`Gallery image ${img?._id}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:grayscale"
                        onClick={() => handleViewImages(images.indexOf(img))}
                      />
                      <Checkbox
                        className="absolute left-1 bottom-1 w-6 h-6 bg-card border rounded-md"
                        checked={selectedImages.some(
                          (selected) => selected?._id === img?._id,
                        )}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(checked, img)
                        }
                      />
                      <div className="absolute top-1 right-1">
                        <div
                          className="hidden group-hover:flex items-center justify-center w-6 h-6 bg-red-900 rounded-md transition-opacity duration-300 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete([img]);
                          }}
                        >
                          <Minus className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <NotFound className="mx-auto w-1/2" />
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

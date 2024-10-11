"use client";

import NotFound from "@/components/shared/not-found";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Title from "@/components/ui/title";
import useCarousal from "@/hooks/use-carousal";
import useUploadImages from "@/hooks/use-upload-images";
import { deleteGalleryFn, getGalleryFn } from "@/services/gallery";
import { showAlert } from "@/services/handle-api";
import ShimmerGalleryCard from "@/shimmer/Spanel/gallery-card-shimmer";
import { ImageType } from "@/types/image-types";
import { Trash, Upload } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export default function Gallery() {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<ImageType[]>([]);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState<
    ImageType[] | null
  >(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const { handleOpenUploadImages, handleSetRefetch } = useUploadImages();
  const { handleSetImages } = useCarousal();

  const getGalleries = useCallback(() => {
    getGalleryFn().then((data) => {
      setImages(data?.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    getGalleries();
  }, [getGalleries]);

  const handleDelete = async (imagesToDelete: ImageType[]) => {
    setIsDeleteLoading(true);
    const formData = new FormData();
    imagesToDelete.forEach((img, i) =>
      formData.append(`image[${i}]`, img.public_id as string)
    );
    const data = await deleteGalleryFn(formData);
    showAlert(data);
    getGalleries();
    setIsDeleteLoading(false);
    setDeleteDialogOpen(null);
  };

  return (
    <>
      <div className="flex justify-between">
        <Title title={"Gallery"} />
        <div className="flex gap-2">
          <Button
            variant={"outline"}
            className="flex justify-center gap-2 items-center"
            onClick={() => {
              handleSetRefetch(getGalleries);
              handleOpenUploadImages();
            }}
          >
            <Upload className="w-4 h-4" /> Upload Images
          </Button>
          {/* <Button
            variant={"destructive"}
            className="flex justify-center gap-2 items-center"
            disabled={images.length === 0}
            onClick={() => setDeleteDialogOpen(images)}
          >
            <Trash className="w-4 h-4" /> Delete All Images
          </Button> */}
        </div>
      </div>

      {loading && images.length === 0 && <ShimmerGalleryCard />}
      <div className="mt-4 grid grid-cols-4 gap-4 ">
        {!loading &&
          images.length > 0 &&
          images.map((img, index) => (
            <div
              key={index}
              className="relative h-[300px] group overflow-hidden"
            >
              <Image
                src={img?.url as string}
                width={1000}
                height={600}
                alt={`Uploaded image ${index + 1}`}
                className="w-full h-full rounded-md object-cover group-hover:scale-105 group-hover:grayscale duration-150 cursor-pointer"
                onClick={() =>
                  handleSetImages(images.map((o) => o.url) as string[], index)
                }
              />
              <Button
                variant={"destructive"}
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteDialogOpen([img]);
                }}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          ))}
      </div>
      {!loading && images.length === 0 && (
        <NotFound className="w-1/3 mx-auto" />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!isDeleteDialogOpen}
        onOpenChange={() => setDeleteDialogOpen(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription>
              This action will permanently delete the selected images from the
              gallery, categories, and MODS. Do you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button
              variant={"outline"}
              onClick={() => setDeleteDialogOpen(null)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              variant={"destructive"}
              onClick={() => handleDelete(isDeleteDialogOpen as ImageType[])}
            >
              {isDeleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useCarousal from "@/hooks/use-carousal";
import useSelectImages from "@/hooks/use-select-images";
import { patchCategoryFn, postCategoryFn } from "@/services/category";
import { showAlert } from "@/services/handle-api";
import { UpdateCategoryPropsTypes } from "@/types/category-types";
import { ImageTypeWithID } from "@/types/image-types";
import { Camera, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface FormData {
  title: string;
}

export function AddUpdateCategory({
  fetchData,
  action,
  setAction,
}: UpdateCategoryPropsTypes) {
  const defaultValues = useMemo(
    () => ({
      title: "",
    }),
    [],
  );

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    selectedImages,
    setSelectDialogOpen,
    handelDeleteSingleSelectedImages,
    handleDeleteAllSelectedImages,
    handleDialogClose,
    setSelectedImages,
  } = useSelectImages();
  const { handleSetImages } = useCarousal();

  useEffect(() => {
    if (action?.type === "update") {
      reset({
        title: action?.data?.title,
      });
      if (action?.data?.image)
        setSelectedImages([action?.data?.image as ImageTypeWithID]);
    }

    return () => handleDeleteAllSelectedImages();
  }, [reset, action, setSelectedImages, handleDeleteAllSelectedImages]);

  const handleClose = () => {
    setIsLoading(false);
    setAction(null);
    reset(defaultValues);
    handleDeleteAllSelectedImages();
    handleDialogClose();
  };

  const onSubmit: SubmitHandler<FormData> = async () => {
    setIsLoading(true);
    const bodyData = new FormData();
    bodyData.append("title", getValues("title"));
    bodyData.append("image", selectedImages[0]?._id);

    const _id = action?.data?._id;
    if (action?.type === "update" && _id) {
      bodyData.append("_id", _id);
      await patchCategoryFn(bodyData)
        .then((data) => showAlert(data))
        .then(() => {
          fetchData();
          handleClose();
        })
        .finally(() => setIsLoading(false));
    } else {
      await postCategoryFn(bodyData)
        .then((data) => showAlert(data))
        .then(() => {
          fetchData();
          handleClose();
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <Dialog open={!!action} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {action?.type === "update" ? "Update Category" : "Add New Category"}
          </DialogTitle>
          <DialogDescription>
            {action?.type === "update"
              ? "Update the category details below."
              : "Fill in the details to add a new category."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center gap-4">
            <Label htmlFor="title" className="text-start">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Enter category title"
              {...register("title", { required: "Title is required" })}
              className="col-span-3"
            />
            {errors.title && (
              <p className="text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Image Upload Area */}
          <div className="relative w-full h-[300px] overflow-hidden rounded-md border flex items-center justify-center cursor-pointer">
            {selectedImages[0] ? (
              <>
                {/* Main Image Display */}
                <Image
                  src={selectedImages[0].url as string}
                  width={400}
                  height={400}
                  alt="Selected image preview"
                  className="object-cover w-full h-full"
                  onClick={() =>
                    handleSetImages([selectedImages[0].url as string], 0)
                  }
                />

                {/* Small Bottom-right Image Preview */}
                <div className="absolute bottom-2 right-2 w-16 h-16 border rounded-full overflow-hidden">
                  <Image
                    src={selectedImages[0].url as string}
                    width={64}
                    height={64}
                    alt="Preview thumbnail"
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  className="absolute bottom-2 right-2 p-1 bg-primary rounded-full hover:bg-primary-dark transition-all"
                  onClick={() => setSelectDialogOpen(1)}
                >
                  <Camera className="w-5 h-5 text-white" />
                </button>
                {/* Delete Image Icon */}
                <button
                  className="absolute bottom-2 right-10 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-all"
                  onClick={() =>
                    handelDeleteSingleSelectedImages(selectedImages[0])
                  }
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </button>
              </>
            ) : (
              <Camera
                className="w-24 h-24 text-gray-400"
                onClick={() => setSelectDialogOpen(1)}
              />
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading
                ? "Loading..."
                : action?.type === "update"
                  ? "Update"
                  : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

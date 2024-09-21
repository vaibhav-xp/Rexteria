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
import { patchCategoryFn, postCategoryFn } from "@/services/category";
import { showAlert } from "@/services/handle-api";
import { UpdateCategoryPropsTypes } from "@/types/category-types";
import { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface FormData {
  title: string;
  image: File | null;
}

export function AddUpdateCategory({
  fetchData,
  action,
  setAction,
}: UpdateCategoryPropsTypes) {
  const defaultValues = useMemo(
    () => ({
      title: "",
      image: null,
    }),
    []
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (action?.type === "update") {
      reset({
        title: action?.data?.title,
      });
    }
  }, [reset, action]);

  const handleClose = () => {
    setFile(null);
    setIsLoading(false);
    setAction(null);
    reset(defaultValues);
  };

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    setIsLoading(true);
    const form = new FormData();
    form.append("title", formData.title);
    if (file) {
      form.append("image", file);
    }

    const _id = action?.data?._id;
    if (action?.type === "update" && _id) {
      form.append("_id", _id);
      await patchCategoryFn(form).then((data) => showAlert(data));
    } else {
      await postCategoryFn(form).then((data) => showAlert(data));
    }
    fetchData();
    handleClose();
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
          <div className="grid grid-cols-1 items-center gap-4">
            <Label htmlFor="image" className="text-start">
              Image
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const selectedFile = e.target.files ? e.target.files[0] : null;
                setFile(selectedFile);
                setValue("image", selectedFile);
              }}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
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

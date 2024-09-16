"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { UpdateCategory } from "@/types/category";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

// Define form data type
interface FormData {
  title: string;
  image: File | null;
  fetchData: () => Promise<void>;
}

export function AddUpdateCategory({
  data,
  fetchData,
}: {
  data?: UpdateCategory;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: data?.title || "",
      image: null,
    },
  });

  const [file, setFile] = useState<File | null>(null);

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      // Create FormData object and append fields manually
      const form = new FormData();
      form.append("title", formData.title);
      if (file) {
        form.append("image", file);
      }

      await axios.post("/api/category", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast({
        title: "Success",
        description: "Category added/updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add/update category.",
      });
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle size={18} className="mr-2" />
          {data ? "Update Category" : "Add New Category"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {data ? "Update Category" : "Add New Category"}
          </DialogTitle>
          <DialogDescription>
            {data
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
            <Button type="submit">{data ? "Update" : "Add"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

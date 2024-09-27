"use client";

import EditSepecification from "@/components/spanel/mods/Specification";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Title from "@/components/ui/title";
import useCarousal from "@/hooks/use-carousal";
import useSelectImages from "@/hooks/use-select-images";
import useStore from "@/hooks/use-store";
import { toast } from "@/hooks/use-toast";
import { showAlert } from "@/services/handle-api";
import { getModByIdFn, patchModsFn, postModsFn } from "@/services/mod";
import { ModFormTypes, ModType, SpecificationsTypes } from "@/types/mod-types";
import { Camera, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";

// Dynamically import ReactQuill for client-side rendering only
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface Params {
  slug: string[];
}

export default function AddUpdate({ params }: { params: Params }) {
  const router = useRouter();
  const { handleSetImages } = useCarousal();
  const { categories } = useStore();
  const [loading, setLoading] = useState(false);
  const [specifications, setSpecifications] = useState<SpecificationsTypes[]>(
    [],
  );
  const {
    selectedImages,
    setSelectDialogOpen,
    handelDeleteSingleSelectedImages,
    handleDeleteAllSelectedImages,
    setSelectedImages,
  } = useSelectImages();
  const viewImages = useMemo(
    () => selectedImages.map((img) => img?.url),
    [selectedImages],
  );
  const { slug } = params;
  const status = slug[0];
  const _id = slug[1];

  const form = useForm<ModFormTypes>({
    defaultValues: {
      title: "",
      price: 0,
      discount: 0,
      content: "",
      categoryId: "",
      isPublic: false,
    },
  });

  const fetchMod = async () => {
    const data = await getModByIdFn(_id);
    const mod: ModType = data?.data;
    console.log(data?.data);
    setSpecifications(mod.specifications);
    form.reset({
      title: mod.title,
      price: mod.price,
      discount: mod.discount,
      content: mod.content,
      categoryId: mod.categoryId?._id,
      isPublic: mod.status,
    });
    const modsImage = [];
    if (mod.main_image) modsImage.push(mod.main_image);
    if (mod.images)
      mod.images.forEach((m) => {
        if (m) modsImage.push(m);
      });
    setSelectedImages(modsImage);
  };

  useEffect(() => {
    if (status === "update" && _id) fetchMod();

    return () => handleDeleteAllSelectedImages();
  }, [status, _id]);

  const onSubmit = (values: ModFormTypes) => {
    if (
      !values.categoryId ||
      !values.discount ||
      !values.price ||
      !values.title ||
      !selectedImages[0]
    ) {
      toast({
        title: "Failed",
        description: "All fields are required, except for the content field.",
      });
      return;
    }

    const reqBodyObject = {
      title: values.title,
      specifications: specifications,
      categoryId: values.categoryId,
      price: values.price,
      discount: values.discount,
      images: selectedImages,
      content: values.content,
      status: values.isPublic,
    };
    setLoading(true);
    if (status === "add" && !_id)
      postModsFn(reqBodyObject)
        .then((data) => showAlert(data))
        .then(() => {
          handleDeleteAllSelectedImages();
          router.replace("/spanel/mods");
        })
        .finally(() => setLoading(false));

    if (status === "update" && _id)
      patchModsFn({ _id, ...reqBodyObject })
        .then((data) => showAlert(data))
        .then(() => {
          handleDeleteAllSelectedImages();
          router.replace("/spanel/mods");
        })
        .finally(() => setLoading(false));
  };

  const displayImages = (idx: number) =>
    handleSetImages(viewImages as string[], idx);

  return (
    <>
      <Title title={`${status === "add" ? "Add" : "Update"} Mod`} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-end">
            <Button type="submit" variant={"default"}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
          <div className="grid grid-cols-[60%_1fr] gap-4 mt-8">
            <div className="border-r pr-4">
              {/* Main Image Upload */}
              <div className="w-full h-[500px] rounded-md border grid place-content-center cursor-pointer relative overflow-hidden group">
                {selectedImages && selectedImages[0] ? (
                  <>
                    <Image
                      src={selectedImages[0]?.url as string}
                      width={400}
                      height={400}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      onClick={() => displayImages(0)}
                    />
                    <label
                      htmlFor="main_image"
                      className="cursor-pointer h-10 w-10 absolute bottom-4 right-4 z-1 bg-primary rounded-full group-hover:grid place-content-center opacity-40 hover:opacity-100 transition-opacity duration-200 hidden"
                      onClick={() => setSelectDialogOpen(6)}
                    >
                      <Camera className="w-6 h-6 text-card" />
                    </label>
                    <label
                      className="cursor-pointer h-10 w-10 absolute bottom-4 right-16 z-1 bg-red-500 rounded-full hidden group-hover:grid place-content-center opacity-40 hover:opacity-100 transition-opacity duration-200"
                      onClick={() =>
                        handelDeleteSingleSelectedImages(selectedImages[0])
                      }
                    >
                      <Trash2 className="w-6 h-6 text-card " />
                    </label>
                  </>
                ) : (
                  <label
                    htmlFor="main_image"
                    className="cursor-pointer w-full h-full"
                    onClick={() => setSelectDialogOpen(6)}
                  >
                    <Camera className="w-20 h-20 text-card" />
                  </label>
                )}
              </div>

              {/* Other Images Upload */}
              <div className="grid grid-cols-5 gap-4 mt-4">
                {selectedImages.slice(1).map((img, index) => (
                  <div
                    key={index}
                    className="w-full h-[100px] overflow-hidden rounded-md border grid place-content-center group cursor-pointer relative"
                  >
                    <Image
                      src={img.url as string}
                      width={400}
                      height={400}
                      alt={`Preview ${index + 1}`}
                      className="h-full w-full object-cover"
                      onClick={() => displayImages(index)}
                    />
                    <label
                      htmlFor={`other-image-${index}`}
                      className="cursor-pointer h-6 w-6 absolute bottom-1 right-1 z-1 bg-primary rounded-full hidden group-hover:grid place-content-center opacity-40 hover:opacity-100 transition-opacity duration-200"
                      onClick={() => setSelectDialogOpen(6)}
                    >
                      <Camera className="w-4 h-4 text-card " />
                    </label>
                    <label
                      className="cursor-pointer h-6 w-6 absolute bottom-1 right-8 z-1 bg-red-500 rounded-full hidden group-hover:grid place-content-center opacity-40 hover:opacity-100 transition-opacity duration-200"
                      onClick={() => handelDeleteSingleSelectedImages(img)}
                    >
                      <Trash2 className="w-4 h-4 text-card " />
                    </label>
                  </div>
                ))}
                {selectedImages.slice(1).length < 5 && (
                  <div className="w-full h-[100px] rounded-md border grid place-content-center cursor-pointer">
                    <label
                      htmlFor={`other_image`}
                      className="cursor-pointer"
                      onClick={() => setSelectDialogOpen(6)}
                    >
                      <Camera className="w-12 h-12 text-card" />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Mod title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Mod price"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Discount"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat._id} value={cat._id}>
                            {cat.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <EditSepecification
                setSpecifications={setSpecifications}
                specifications={specifications}
              />
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center">
                    <FormLabel className="pt-2">Make Mod Public</FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="mt-8">
                <FormLabel>Content</FormLabel>
                <ReactQuill {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
}

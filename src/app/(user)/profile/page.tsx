"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Title from "@/components/ui/title";
import useStore from "@/hooks/use-store";
import { toast } from "@/hooks/use-toast";
import { placeHolderImage } from "@/lib/constants";
import { showAlert } from "@/services/handle-api";
import { patchUserFn } from "@/services/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { CameraIcon } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  country: z.string().min(1, "Country is required"),
  email: z.string().email({ message: "Email must be valid" }),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(/^\d+$/, "Phone number must contain only numbers"),
  instagram: z
    .string()
    .url("Invalid Instagram URL")
    .startsWith("https://www.instagram.com/", {
      message: "Instagram URL must start with https://www.instagram.com/",
    }),
  youtube: z
    .string()
    .url("Invalid YouTube URL")
    .startsWith("https://www.youtube.com/", {
      message: "Youtube URL must start with https://www.youtube.com/",
    })
    .optional(),
  x: z
    .string()
    .url("Invalid X (Twitter) URL")
    .startsWith("https://www.x.com/", {
      message: "X (Twitter) URL must start with https://www.x.com/",
    })
    .optional(),
});

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const { user, refetchUser } = useStore();
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState(placeHolderImage());
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    const formData = new FormData();
    Object.keys(data).map((key) => {
      const typedKey = key as keyof z.infer<typeof schema>;
      if (data[typedKey]) {
        formData.append(typedKey, data[typedKey]);
      }
    });

    if (!file && !image)
      return toast({
        title: "Failed",
        description: "Image is required.",
      });

    if (file) formData.append("avatar", file);
    setLoading(true);
    patchUserFn(formData)
      .then((data) => showAlert(data))
      .then(() => refetchUser())
      .finally(() => setLoading(false));
  };

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) {
      setFile(file);
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };

  useEffect(() => {
    if (user) {
      form.reset({
        name: user?.name,
        email: user?.email,
        country: user?.country,
        phone: user?.phone?.toString(),
        instagram: user?.instagram,
        youtube: user?.youtube,
        x: user?.x,
      });
      setImage(user?.avatar?.url || placeHolderImage(user?.name));
    }
  }, [user]);

  return (
    <>
      <Title title="Profile" />
      <div className="mt-8">
        <div className="relative group w-28 h-28 overflow-hidden rounded-full border-2 border-primary">
          <Image
            src={image}
            width={100}
            height={100}
            alt="profile"
            className="w-full h-full object-cover"
          />

          {/* Icon visible on hover */}
          <label
            htmlFor="input_image"
            className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
          >
            <CameraIcon className="w-8 h-8 text-white" />
          </label>
          <Input
            type="file"
            accept="image/*"
            id="input_image"
            className="hidden"
            onChange={handleImage}
          />
        </div>

        <Form {...form}>
          <form
            className="mt-4 space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input disabled placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input placeholder="Instagram URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="youtube"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube</FormLabel>
                    <FormControl>
                      <Input placeholder="YouTube URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="x"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>X (Twitter)</FormLabel>
                    <FormControl>
                      <Input placeholder="X (Twitter) URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">{loading ? "Updating..." : "Update"}</Button>
          </form>
        </Form>
      </div>
    </>
  );
}

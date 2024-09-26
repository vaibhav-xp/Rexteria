"use client";

import DisplayModImages from "@/components/mods/DisplayModImages";
import NotFound from "@/components/shared/not-found";
import Rating from "@/components/shared/rating";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { getModBySlugFn } from "@/services/mod";
import ShimmerModDetails from "@/shimmer/Mods/mod-details-shimmer";
import { ModType } from "@/types/mod-types";
import { Car, Heart, HomeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { MdOutlineShoppingBag, MdThumbUp, MdVisibility } from "react-icons/md";

export default function SingleModShow({ params }: { params: { _id: string } }) {
  const [mod, setMod] = useState<ModType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMod = async () => {
      try {
        const data = await getModBySlugFn(params._id);
        setMod(data?.data);
      } catch (error) {
        console.error("Error fetching mod:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMod();
  }, [params._id]);

  if (loading) {
    return <ShimmerModDetails />;
  }

  if (!mod) {
    return <NotFound className="mx-auto w-1/3" />;
  }

  return (
    <div className="container py-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex gap-1">
              <HomeIcon className="w-4 h-4" /> Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/mods" className="flex gap-1">
              <Car className="w-4 h-4" /> Mods
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/mods?category=${mod?.categoryId?._id}`}>
              {mod?.categoryId?.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbPage>{mod.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid grid-cols-1 lg:grid-cols-[60%_1fr] my-4 gap-4">
        <DisplayModImages images={[mod.main_image, ...mod.images]} />
        <div>
          <div className="flex justify-between items-center font-poppins">
            <Rating rating={mod.rating} className="justify-start mb-2" />
          </div>

          <h1 className="text-2xl font-bold mb-2">{mod.title}</h1>

          {/* Views and Likes Section */}
          <div className="flex gap-4 items-center mb-4">
            <div className="flex gap-2 items-center">
              <MdVisibility className="text-primary text-lg" />
              <span className="text-sm text-gray-600">{mod.views} Views</span>
            </div>
            <div className="flex gap-2 items-center">
              <MdThumbUp className="text-primary text-lg" />
              <span className="text-sm text-gray-600">
                {mod?.likes || 0} Likes
              </span>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              {/* Discounted Price */}
              <span className="text-2xl font-bold text-green-600">
                ₹{mod.discount_price.toFixed(0)}
              </span>

              {/* Original Price with a strikethrough */}
              {mod.discount > 0 && (
                <p className="text-sm text-gray-500 line-through">
                  ₹{mod.price.toFixed(2)}
                </p>
              )}
            </div>

            {/* Discount Information */}
            {mod.discount > 0 && (
              <p className="text-sm text-green-500 mt-1">
                Save {mod.discount}%!
              </p>
            )}
          </div>

          <div className="mt-4">
            <h2 className="text-base font-semibold">Specifications</h2>
            <Table>
              <TableBody>
                {mod.specifications.map((spec) => (
                  <TableRow key={spec.type} className="text-sm">
                    <TableCell>{spec.type}</TableCell>
                    <TableCell>{spec.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button className="w-full my-4 flex gap-1">
              <Heart className="w-6 h-6" /> Add To Wishlist
            </Button>
            <Button className="w-full my-4 flex gap-1">
              <MdOutlineShoppingBag className="w-6 h-6 " /> Add To Cart
            </Button>
          </div>

          <div className="mt-8">
            <h4 className="text-base font-semibold">Description:</h4>
            <article
              className="mt-4 text-sm text-gray-400 font-poppins"
              dangerouslySetInnerHTML={{ __html: mod?.content }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

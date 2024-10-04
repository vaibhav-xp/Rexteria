"use client";

import NotFound from "@/components/shared/not-found";
import Rating from "@/components/shared/rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Title from "@/components/ui/title";
import useCarousal from "@/hooks/use-carousal";
import { showAlert } from "@/services/handle-api";
import { deleteWishlistFn, getWishlistFn } from "@/services/wishlist";
import CartShimmer from "@/shimmer/cart-shimmer";
import { ModType } from "@/types/mod-types";
import { ThumbsUp, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Whishlist() {
  const { handleSetImages } = useCarousal();
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<ModType[]>([]);

  const getData = () => {
    getWishlistFn()
      .then((data) => {
        setWishlistItems(data?.data?.mods || []);
      })
      .finally(() => setLoading(false));
  };

  const deleteFn = (_id: string) => {
    deleteWishlistFn({ mod_id: _id })
      .then((data) => showAlert(data))
      .then(() => getData());
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Title title="Wishlist" />
      {!loading && wishlistItems?.length > 0 && (
        <div className="mt-4 overflow-y-scroll">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlistItems.map((mod) => (
              <Card
                key={`${mod?._id}`}
                className="shadow-md transition-all hover:shadow-lg rounded-lg overflow-hidden"
              >
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={mod?.main_image?.url}
                    alt={mod?.title}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 cursor-pointer"
                    onClick={() =>
                      handleSetImages(
                        [
                          mod?.main_image?.url,
                          ...mod?.images.map((img) => img.url),
                        ],
                        0,
                      )
                    }
                  />
                </div>
                <CardContent className="p-4">
                  <CardTitle className="text-xl font-semibold mb-2">
                    <Link
                      href={`/mods/${mod?.slug}`}
                      className="w-full text-ellipsis whitespace-nowrap overflow-hidden block"
                    >
                      {mod?.title}
                    </Link>
                  </CardTitle>
                  <div className="flex justify-between items-center mb-4">
                    <Rating
                      rating={mod?.rating}
                      className="justify-start mt-2"
                    />
                    <div className="flex gap-2 items-center">
                      <ThumbsUp className="text-primary text-lg w-4 h-4" />
                      <span className="text-sm text-gray-600">
                        {mod?.likes} Likes
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold">
                      Price: ₹
                      <span className="line-through text-red-500">
                        {mod.price}
                      </span>{" "}
                      <span className="text-primary">
                        {mod?.discount_price}
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex items-center gap-2"
                      onClick={() => deleteFn(mod?._id)}
                    >
                      <Trash size={16} />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      {loading && <CartShimmer />}
      {!loading && wishlistItems.length === 0 && (
        <NotFound className="h-[80vh]" />
      )}
    </>
  );
}

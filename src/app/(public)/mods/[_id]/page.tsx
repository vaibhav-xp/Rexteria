"use client";

import TopRatingMods from "@/components/home/top-rating-mods";
import DisplayModImages from "@/components/mods/DisplayModImages";
import RatingDialog from "@/components/mods/RatingDialog";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import useStore from "@/hooks/use-store";
import { displayViews } from "@/lib/constants";
import { addToCartFn } from "@/services/cart";
import { loginFirst, showAlert } from "@/services/handle-api";
import { getModBySlugFn } from "@/services/mod";
import { getRatingFn, patchRatingFn, postViewsFn } from "@/services/review";
import { addToWishlistFn } from "@/services/wishlist";
import ShimmerModDetails from "@/shimmer/Mods/mod-details-shimmer";
import { ModType } from "@/types/mod-types";
import { ReviewType } from "@/types/review-types";
import {
  Car,
  Heart,
  HomeIcon,
  Instagram,
  Link as LinkIcon,
  Share2Icon,
  TwitterIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import {
  MdOutlineShoppingBag,
  MdOutlineThumbUp,
  MdThumbUp,
  MdVisibility,
} from "react-icons/md";

export default function SingleModShow({ params }: { params: { _id: string } }) {
  const { user, refetchCartData } = useStore();
  const [mod, setMod] = useState<ModType | null>(null);
  const [review, setReview] = useState<ReviewType | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewHitOnce, setVewHitOnce] = useState(true);
  const [isRatingLoading, setIsRatingLoading] = useState(true);
  const [share, setShare] = useState(false);
  const url = useMemo(() => window.location.href, []);

  const fetchMod = useCallback(async () => {
    try {
      const data = await getModBySlugFn(params._id);
      setMod(data?.data);
    } finally {
      setLoading(false);
    }
  }, [params?._id]);

  useEffect(() => {
    fetchMod();
  }, [params._id, fetchMod]);

  const addToCart = () => {
    loginFirst(user, () => {
      const formData = new FormData();
      if (!mod) return;
      formData.append("mod_id", mod._id);
      addToCartFn(formData)
        .then((data) => showAlert(data))
        .then(() => refetchCartData());
    });
  };

  const getRatings = useCallback(() => {
    if (user && mod)
      getRatingFn({ mod_id: mod?._id })
        .then((data) => setReview(data?.data))
        .finally(() => setIsRatingLoading(false));
  }, [user, mod]);

  const addToWishlilst = () => {
    loginFirst(user, () => {
      const formData = new FormData();
      if (!mod) return;
      formData.append("mod_id", mod._id);
      addToWishlistFn(formData)
        .then((data) => showAlert(data))
        .then(() => getRatings());
    });
  };

  const handleLikeSubmit = () => {
    loginFirst(user, () => {
      patchRatingFn({
        mod_id: mod?._id,
        like: review?.likes ? "false" : "true",
      })
        .then((data) => showAlert(data))
        .then(() => fetchMod())
        .then(() => getRatings());
    });
  };

  useEffect(() => {
    getRatings();
  }, [getRatings]);

  useEffect(() => {
    if (mod && viewHitOnce && mod?.status) {
      const formData = new FormData();
      formData.append("mod_id", mod?._id);
      postViewsFn(formData);
      setVewHitOnce(false);
    }
  }, [mod, viewHitOnce]);

  if (loading) {
    return <ShimmerModDetails />;
  }

  if (!mod) {
    return <NotFound className="mx-auto w-1/3" />;
  }

  const handleShare = () => setShare((prev) => !prev);

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
            {/* Display Rating Count */}
            <span className="text-sm text-gray-600">
              {mod?.reviewCount || 0} Ratings
            </span>
          </div>

          <h1 className="text-2xl font-bold mb-2">{mod.title}</h1>

          {/* Views and Likes Section */}
          <div className="flex gap-4 items-center mb-4 justify-between">
            <div className="flex gap-4 items-center">
              <div className="flex gap-2 items-center">
                <MdVisibility className="text-primary text-lg" />
                <span className="text-sm text-gray-600">
                  {displayViews(mod.views)} Views
                </span>
              </div>
              <div className="flex gap-2 items-center">
                {review && review.likes ? (
                  <MdThumbUp
                    className="text-primary text-lg cursor-pointer"
                    onClick={handleLikeSubmit}
                  />
                ) : (
                  <MdOutlineThumbUp
                    className="text-primary text-lg cursor-pointer"
                    onClick={handleLikeSubmit}
                  />
                )}
                <span className="text-sm text-gray-600">
                  {mod?.likes || 0} Likes
                </span>
              </div>
            </div>
            <Share2Icon
              className="text-primary cursor-pointer"
              onClick={handleShare}
            />
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
            <Button className="w-full my-4 flex gap-1" onClick={addToWishlilst}>
              <Heart className="w-6 h-6" /> Add To Wishlist
            </Button>
            <Button className="w-full my-4 flex gap-1" onClick={addToCart}>
              <MdOutlineShoppingBag className="w-6 h-6 " /> Add To Cart
            </Button>
          </div>

          {!isRatingLoading && (!review || (review && review.rating === 0)) && (
            <RatingDialog mod={mod} fetchMod={fetchMod} />
          )}

          <div className="mt-8">
            <h4 className="text-base font-semibold">Description:</h4>
            <article
              className="mt-4 text-sm text-gray-400 font-poppins"
              dangerouslySetInnerHTML={{ __html: mod?.content }}
            />
          </div>
        </div>
      </div>
      {/* Top Rated Mods Section */}
      <TopRatingMods />

      <Dialog open={share} onOpenChange={handleShare}>
        <DialogContent>
          <DialogHeader className="flex justify-between items-center">
            <DialogTitle className="text-xl">Share</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4 mt-4">
            {/* Icons for sharing on platforms */}
            <div className="flex items-center space-x-4">
              {/* WhatsApp */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="w-6 h-6 hover:text-primary cursor-pointer" />
              </a>

              {/* Instagram */}
              <a
                href={`https://www.instagram.com/?url=${url}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-6 h-6 hover:text-primary cursor-pointer" />
              </a>

              {/* Twitter */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  `Check this out: ${url}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon className="w-6 h-6 hover:text-primary cursor-pointer" />
              </a>
            </div>
            <DialogDescription>Or</DialogDescription>
            {/* Copy link functionality */}
            <div
              className="flex items-center space-x-2 hover:brightness-50 duration-200 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(url);
                showAlert({ message: "Link copied to clipboard!" });
              }}
            >
              <LinkIcon className="w-5 h-5" />
              <span className="px-2 py-1 bg-card">{url}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

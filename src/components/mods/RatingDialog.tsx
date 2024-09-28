"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ModType } from "@/types/mod-types";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoStarOutline, IoStarSharp } from "react-icons/io5";
import Rating from "../shared/rating";
import { Button } from "../ui/button";

export default function RatingDialog({ mod }: { mod: ModType }) {
  const [open, setOpen] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);

  const handleRatingChange = (newRating: number) => {
    setRatingValue(newRating);
  };

  const handleDialogOpen = (newState: boolean) => {
    if (!newState) {
      setRatingValue(0);
    }
    setOpen(newState);
  };

  useEffect(() => {
    let timer: NodeJS.Timer | null = null;

    if (!open) {
      timer = setInterval(() => {
        setOpen(true);
      }, 30000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full flex gap-2">
          <Rating rating={0} /> Rate this Mod
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Rate this Mod</DialogTitle>
          <DialogDescription className="text-lg">
            {mod?.title}
          </DialogDescription>
        </DialogHeader>
        <Carousel
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
        >
          <CarouselContent>
            {[mod?.main_image, ...mod?.images].map((img, index) => (
              <CarouselItem
                key={index}
                className="overflow-hidden aspect-video"
              >
                <div className="w-full h-full overflow-hidden rounded-lg">
                  <Image
                    src={img?.url as string}
                    alt={`image-${index}`}
                    width={1280}
                    height={720}
                    className="w-full h-full transition-transform duration-300 ease-in-out hover:scale-105 object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="flex gap-2 justify-center my-4">
          {Array.from({ length: 5 }, (_, index) =>
            ratingValue >= index + 1 ? (
              <IoStarSharp
                key={index}
                className="text-primary text-4xl"
                onMouseOver={() => setRatingValue(index + 1)}
              />
            ) : (
              <IoStarOutline
                key={index}
                className="text-gray-600 text-4xl"
                onMouseOver={() => setRatingValue(index + 1)}
              />
            ),
          )}
        </div>
        <Button disabled={ratingValue === 0}>Submit</Button>
      </DialogContent>
    </Dialog>
  );
}

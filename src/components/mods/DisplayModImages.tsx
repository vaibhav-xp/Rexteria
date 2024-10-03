"use client";

import { ImageTypeWithID } from "@/types/image-types";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "../ui/carousel";
import Image from "next/image";
import { cn } from "@/lib/utils";
import useCarousal from "@/hooks/use-carousal";
import { EyeIcon } from "lucide-react";

export default function DisplayModImages({
  images,
}: {
  images: ImageTypeWithID[];
}) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const { handleSetImages } = useCarousal();

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="lg:sticky lg:top-28 space-y-4">
      {/* Main Carousel */}
      <div className="sticky top-28 space-y-4">
        <Carousel
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
          opts={{ align: "start", loop: true }}
          className="w-full"
          setApi={setApi}
        >
          <CarouselContent>
            {images.map((img, index) => (
              <CarouselItem
                key={index}
                className="overflow-hidden aspect-video"
              >
                <div className="w-full h-full overflow-hidden rounded-lg">
                  <Image
                    src={img.url as string}
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

        <Carousel className="w-full">
          <CarouselContent className="space-x-1">
            {images.map((img, index) => (
              <CarouselItem
                key={index}
                className={cn(
                  "overflow-hidden basis-1/4 sm:basis-1/2 md:basis-1/4 cursor-pointer h-[60px] md:h-[120px]",
                )}
                onClick={() => api?.scrollTo(index)}
              >
                <div
                  className={cn(
                    "w-full h-full overflow-hidden rounded-md aspect-video ",
                    current - 1 === index && "border-primary border ",
                  )}
                >
                  <Image
                    src={img.url as string}
                    alt={`thumbnail-${index}`}
                    width={300}
                    height={200}
                    className={cn(
                      "w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105",
                    )}
                  />
                </div>
              </CarouselItem>
            ))}
            <CarouselItem
              className={cn(
                "rounded-md overflow-hidden basis-1/3 sm:basis-1/2 md:basis-1/4 cursor-pointer",
              )}
              onClick={() =>
                handleSetImages(images.map((img) => img.url) as string[], 0)
              }
            >
              <div className="flex flex-col justify-center items-center bg-card text-gray-400 overflow-hidden rounded-lg gap-2 h-full">
                <EyeIcon className="w-6 h-6 text-gray-500" />{" "}
                {/* Adding the icon */}
                <span className="text-sm">View All Images</span>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}

"use client";

import { ImageTypeWithID } from "@/types/image-types";
import { Card, CardContent } from "../ui/card";
import Autoplay from "embla-carousel-autoplay"; // Uncomment if you want autoplay
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Image from "next/image";
import { type CarouselApi } from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function DisplayModImages({
  images,
}: {
  images: ImageTypeWithID[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div>
      {/* Main Carousel */}
      <div className="sticky top-28 space-y-4">
        <div>
          <Carousel
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
            setApi={setApi}
          >
            <CarouselContent>
              {images.map((img, index) => (
                <CarouselItem
                  key={index}
                  className="rounded-lg overflow-hidden aspect-video"
                >
                  <Image
                    src={img.url as string}
                    alt={`image-${index}`}
                    width={1280}
                    height={720}
                    className="w-full h-full transition-transform duration-300 ease-in-out hover:scale-105 object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Thumbnail Carousel */}
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((img, index) => (
                <CarouselItem
                  key={index}
                  className={cn(
                    "rounded-md overflow-hidden basis-1/4 sm:basis-1/2 md:basis-1/4 cursor-pointer h-[60px] md:h-[120px]"
                  )}
                  onClick={() => {
                    console.log(index);
                    api?.scrollTo(index);
                  }}
                >
                  <Image
                    src={img.url as string}
                    alt={`thumbnail-${index}`}
                    width={300}
                    height={200}
                    className={cn(
                      "w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105",
                      current === index && "border-primary border"
                    )}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
}

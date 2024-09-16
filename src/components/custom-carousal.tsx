"use client";

import React, { useRef } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { cn } from "@/lib/utils";
import useCarousal from "@/hooks/use-carousal";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";

const CustomCarousal = () => {
  const { images, handleRemoveImages } = useCarousal();
  const divRef = useRef(null);

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (divRef.current && e.target === divRef.current) {
      handleRemoveImages();
    }
  };

  return (
    <div
      ref={divRef}
      className={cn(
        images ? "flex" : "hidden",
        "fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 items-center justify-center transition-opacity duration-500 ease-in-out",
        images ? "opacity-100" : "opacity-0",
      )}
      onClick={handleClose}
    >
      <Button
        variant={"outline"}
        className="rounded-full w-12 h-12 absolute right-8 top-8"
        onClick={(e) => {
          e.stopPropagation();
          handleRemoveImages();
        }}
      >
        <Cross2Icon />
      </Button>
      <Carousel className="md:w-4/5 w-full">
        <CarouselContent>
          {images?.map((item, index) => (
            <CarouselItem key={index}>
              <Image src={item} alt="Sample" className="w-full" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2" />
        <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2" />
      </Carousel>
    </div>
  );
};

export default CustomCarousal;

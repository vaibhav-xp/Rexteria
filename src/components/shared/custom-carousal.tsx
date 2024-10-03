"use client";

import React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import useCarousal from "@/hooks/use-carousal";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { DialogContent } from "@radix-ui/react-dialog";

const CustomCarousal = () => {
  const { images, handleRemoveImages } = useCarousal();

  return (
    <Dialog open={!!images} onOpenChange={handleRemoveImages}>
      <DialogContent className="z-[99999999] fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-300">
        {/* Close Button */}
        <Button
          variant="outline"
          className="rounded-full w-12 h-12 absolute right-8 top-8 z-[99999999]"
          aria-label="Close Image Carousel"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveImages();
          }}
        >
          <Cross2Icon className="w-10 h-10" />
        </Button>

        {/* Carousel */}
        <Carousel className="md:w-4/5 w-full h-[90vh] overflow-hidden rounded-xl flex items-center justify-center">
          <CarouselContent className="h-full">
            {images?.map((item, index) => (
              <CarouselItem key={index}>
                <Image
                  src={item}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-contain rounded-lg shadow-lg my-auto"
                  width={1000}
                  height={600}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Carousel Navigation */}
          {images && (
            <>
              <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pimary z-[99999999] cursor-pointer p-2 bg-card bg-opacity-70 rounded-full" />
              <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 text-pimary z-[99999999] cursor-pointer p-2 bg-card bg-opacity-70 rounded-full" />
            </>
          )}
        </Carousel>
      </DialogContent>
    </Dialog>
  );
};

export default CustomCarousal;

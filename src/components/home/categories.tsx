"use client";

import useStore from "@/hooks/use-store";
import ShimmerCategoriesHome from "@/shimmer/Home/categories-shimmer";
import Image from "next/image";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Title from "../ui/title";

export default function TopCategories() {
  const { categories, isCategoriesLoading } = useStore();

  return (
    <div className="container my-10">
      <Title title="Top Categories" className="text-2xl mb-4" />
      {!isCategoriesLoading && categories.length > 0 && (
        <Carousel>
          <CarouselContent>
            {categories?.map((cat) => (
              <>
                {cat?.image?.url && (
                  <CarouselItem
                    key={cat._id}
                    className="relative overflow-hidden aspect-square basis-1/2 md:basis-1/4 lg:basis-1/6 group"
                  >
                    <div className="overflow-hidden w-full h-full rounded-lg">
                      <Image
                        src={cat?.image?.url}
                        width={400}
                        height={400}
                        alt={cat?.title}
                        className="w-full h-full object-cover brightness-75 group-hover:brightness-50 scale-100 group-hover:scale-110 duration-500 ease-in-out"
                      />
                    </div>

                    {/* Text and Button container */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center bg-gradient-to-t from-black/60 to-transparent opacity-100 group-hover:bg-black/30 transition-all duration-500 ease-in-out">
                      <h4 className="text-2xl font-bold tracking-wide transition-transform duration-500 transform translate-y-0 group-hover:-translate-y-3">
                        {cat?.title}
                      </h4>

                      {/* Explore button with background animation */}
                      <Link
                        href={`/mods?category=${cat._id}`}
                        className="relative mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full overflow-hidden text-lg font-semibold group-hover:scale-105 transition-all duration-500 ease-in-out"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                        <span className="relative z-10">Explore</span>
                      </Link>
                    </div>
                  </CarouselItem>
                )}
              </>
            ))}
            {/* "Show All Categories" at the end */}
            <CarouselItem className="relative overflow-hidden aspect-square basis-1/2 md:basis-1/4 lg:basis-1/6 group">
              <div className="overflow-hidden w-full h-full rounded-lg bg-indigo-600 flex items-center justify-center brightness-50 group transition-all duration-200 hover:brightness-90">
                <Link
                  href={"/categories"}
                  className="text-white text-3xl font-bold tracking-wide transition-transform duration-500 transform translate-y-0 group-hover:-translate-y-3"
                >
                  Show All
                </Link>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      )}
      {isCategoriesLoading && <ShimmerCategoriesHome />}
    </div>
  );
}

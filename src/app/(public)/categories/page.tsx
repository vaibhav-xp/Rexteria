"use client";

import BannerCatgories from "@/components/Categories/Banner";
import NotFound from "@/components/shared/not-found";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import useStore from "@/hooks/use-store";
import { ShimmerCategoryPage } from "@/shimmer/Home/categories-shimmer";
import { HomeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Categories() {
  const { categories, isCategoriesLoading } = useStore();

  return (
    <main>
      <BannerCatgories />
      <div className="container my-8 space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex gap-1">
                <HomeIcon className="w-4 h-4" /> Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Categories</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {!isCategoriesLoading && (
          <>
            {categories.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat?._id}
                    className="overflow-hidden w-full rounded-lg relative h-[200px] group"
                  >
                    <Image
                      src={cat?.image?.url}
                      width={400}
                      height={400}
                      alt={cat?.title}
                      className="w-full h-full object-cover brightness-75 group-hover:brightness-50 scale-100 group-hover:scale-110 duration-500 ease-in-out"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center bg-gradient-to-t from-black/60 to-transparent opacity-100 group-hover:bg-black/30 transition-all duration-500 ease-in-out">
                      <h4 className="text-3xl font-bold tracking-wide transition-transform duration-500 transform translate-y-0 group-hover:-translate-y-3">
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
                  </div>
                ))}
              </div>
            )}
            {categories.length === 0 && <NotFound className="mx-auto w-1/2" />}
          </>
        )}

        {isCategoriesLoading && <ShimmerCategoryPage />}
      </div>
    </main>
  );
}

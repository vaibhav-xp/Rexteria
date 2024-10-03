"use client";

import TopCategories from "@/components/home/categories";
import TopRatingMods from "@/components/home/top-rating-mods";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Title from "@/components/ui/title";
import useStore from "@/hooks/use-store";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useRouter } from "next/navigation";
import banner_1 from "@/assets/banner_home.webp";
import banner_2 from "@/assets/banner_home_2.webp";
import banner_3 from "@/assets/banner_home_3.webp";
import banner_4 from "@/assets/bg-mods.webp";

const slidesData = [
  {
    id: 2,
    title: "Unleash the Ultimate GTA 5 Experience",
    description:
      "Premium mods available, with custom car modifications for an additional charge.",
    imgSrc: banner_1,
    buttonPrimary: "Shop Now",
    buttonPrimaryLink: "/mods",
    buttonSecondary: "Sign Up",
    buttonSecondryLink: "/login",
    position: "0px 40%",
  },
  {
    id: 5,
    title: "Explore Our Categories of GTA 5 Mods",
    description:
      "Browse a wide range of mod categories for endless customization options.",
    imgSrc: banner_3,
    buttonPrimary: "Explore Now",
    buttonPrimaryLink: "/categories",
    buttonSecondary: "Sign Up",
    buttonSecondryLink: "/login",
    position: "40% 80%",
  },
  {
    id: 1,
    title: "Upgrade, Modify, or Go Custom",
    description:
      "Standard mods or custom modifications available, additional charges for customization.",
    imgSrc: banner_2,
    buttonPrimary: "Contact Us",
    buttonPrimaryLink: "/contact",
    buttonSecondary: "Login",
    buttonSecondryLink: "/login",
    position: "0 60%",
  },
  {
    id: 3,
    title: "Your Dream Ride, Customized for You",
    description:
      "Mods plus custom car modifications available for an added fee.",
    imgSrc: banner_4,
    buttonPrimary: "Shop Now",
    buttonPrimaryLink: "/mods",
    buttonSecondary: "Sign Up",
    buttonSecondryLink: "/login",
    position: "0 90%",
  },
  {
    id: 4,
    title: "Drive Your GTA 5 World, Your Way",
    description:
      "Get unique mods or pay extra for personalized custom modifications.",
    imgSrc:
      "https://res.cloudinary.com/dkcaalfg3/image/upload/v1727243337/rexteria/x3yehik6dngasimps0oz.webp",
    buttonPrimary: "Show Now",
    buttonPrimaryLink: "/mods",
    buttonSecondary: "Sign Up",
    buttonSecondryLink: "/login",
    position: "0 10%",
  },
];

export default function Home() {
  const router = useRouter();
  const { user } = useStore();
  return (
    <section>
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-60 z-0"></div>

        <Carousel
          opts={{
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 2500,
            }),
          ]}
        >
          <CarouselContent>
            {/* Mapping through slide data */}
            {slidesData.map((slide) => (
              <CarouselItem
                key={slide.id}
                className="aspect-video overflow-hidden h-[50vh] relative group select-none"
              >
                <Image
                  src={slide.imgSrc}
                  alt={slide.title}
                  width={1920}
                  height={1080}
                  className={`w-full h-full object-cover transition-transform duration-500 ease-in-out transform scale-100 group-hover:scale-110 brightness-50`}
                  style={{ objectPosition: slide.position }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center">
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold drop-shadow-lg tracking-wide leading-tight animate-fade-in w-full px-4">
                    {slide.title}
                  </h1>
                  <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 animate-fade-in delay-100 w-full max-w-full px-4">
                    {slide.description}
                  </p>
                  <div className="flex items-center gap-4 mt-6">
                    <Button
                      variant="default"
                      className="w-40 text-lg transition-transform transform hover:scale-105"
                      onClick={() => router.push(slide.buttonPrimaryLink)}
                    >
                      {slide.buttonPrimary}
                    </Button>
                    {!user && (
                      <Button
                        variant="outline"
                        className=" w-40 text-lg transition-transform transform hover:scale-105"
                        onClick={() => router.push(slide.buttonSecondryLink)}
                      >
                        {slide.buttonSecondary}
                      </Button>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Floating decorative elements */}
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-purple-500 opacity-30 rounded-full blur-3xl z-0 animate-floating"></div>
        <div className="absolute bottom-0 left-0 w-36 h-36 sm:w-48 sm:h-48 bg-pink-500 opacity-30 rounded-full blur-3xl z-0 animate-floating-slow"></div>
      </div>

      {/* Categories Section */}
      <TopCategories />

      {/* Top Rated Mods Section */}
      <TopRatingMods />

      {/* Video Section */}
      <div className="container mx-auto my-12">
        <Title title="Videos" className="text-2xl" />
        <div className="grid gap-6 sm:gap-8 mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div className="overflow-hidden rounded-lg">
            <iframe
              src="https://www.youtube.com/embed/_wQGH8tkr3s?si=PnRmxGP5oHdegXuE"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              className="aspect-video w-full"
            />
          </div>
          <div className="overflow-hidden rounded-lg">
            <iframe
              src="https://www.youtube.com/embed/QY-lCcONVmw?si=9095gOfot_B1htEE"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              className="aspect-video w-full"
            />
          </div>
          <div className="overflow-hidden rounded-lg">
            <iframe
              src="https://www.youtube.com/embed/MnGIT3Ax6Hg?si=pwnDhT04uevC0mO0"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              className="aspect-video w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

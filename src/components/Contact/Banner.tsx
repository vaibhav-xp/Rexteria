"use client";
import bg_mods from "@/assets/bg-mods.webp";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function BannerContact() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const parallaxOffset = scrollTop * 0.5;
      if (containerRef.current) {
        containerRef.current.style.transform = `translateY(${parallaxOffset}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div className="h-[30vh] overflow-hidden relative">
      <div ref={containerRef} className="absolute inset-0 transition-none">
        <Image
          src={bg_mods}
          layout="fill"
          objectFit="cover"
          objectPosition="0 70%"
          className="brightness-50 fixed"
          alt="background image"
        />
      </div>
      <div className="container h-full w-full relative flex items-center justify-end">
        <h1 className="absolute text-end text-2xl md:text-4xl right-[1rem] -translate-y-1/2 top-1/2 font-700">
          Get in{" "}
          <span className="text-primary hover:text-5xl cursor-pointer transition-all duration-300">
            Touch
          </span>{" "}
          with Us <br /> We&apos;re Here to Help with Your{" "}
          <span className="text-primary hover:text-5xl cursor-pointer transition-all duration-300">
            GTA 5
          </span>{" "}
          <br />
          Modding Needs!
        </h1>
      </div>
    </div>
  );
}

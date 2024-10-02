"use client";

import insta from "@/assets/rexteria_insta.jpg";
import useStore from "@/hooks/use-store";
import { InstagramLogoIcon } from "@radix-ui/react-icons";
import { RefreshCcw, ThumbsUp, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaYoutube } from "react-icons/fa";
import { MdInstallDesktop } from "react-icons/md";
import { Separator } from "../ui/separator";

const featuresData = [
  {
    id: 1,
    title: "Frequent Updates",
    icon: RefreshCcw,
    description:
      "Our mods are consistently updated with new enhancements and fixes to maintain top performance.",
  },
  {
    id: 2,
    title: "Simple Installation",
    icon: MdInstallDesktop,
    description:
      "Easily install our mods in just a couple of minutes for seamless integration with GTA V.",
  },
  {
    id: 3,
    title: "Instant Access",
    icon: Truck,
    description:
      "Get your mods immediately after purchase via digital download, sent directly to your email and account.",
  },
  {
    id: 4,
    title: "High-Quality Mods",
    icon: ThumbsUp,
    description:
      "Our mods are crafted for optimal quality and performance, providing a smooth and reliable experience.",
  },
];

export default function Footer() {
  const { categories } = useStore();

  return (
    <footer className="mt-4">
      {/* Features Grid */}
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {featuresData.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-lg shadow-lg text-center flex flex-col items-center transition-transform duration-300 hover:scale-105 bg-card"
          >
            <item.icon className="w-12 h-12 text-primary mb-4" />
            <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
            <p className="text-sm text-gray-400">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Social Media Links */}
      <div className="mt-8 bg-card py-4">
        <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center">
          <p className="font-bold text-xl">Follow us on social media!</p>
          <div className="flex gap-4 mt-4 lg:mt-0">
            <Link
              href={"https://www.instagram.com/moddingguruji"}
              target="_blank"
              className="hover:text-primary"
            >
              <InstagramLogoIcon className="w-8 h-8" />
            </Link>
            <Link
              href={"https://www.youtube.com"}
              target="_blank"
              className="hover:text-primary"
            >
              <FaYoutube className="w-8 h-8" />
            </Link>
          </div>
        </div>
        <Separator className="my-4 bg-primary" />

        {/* Quick Links, Instagram, Categories, and About Us */}
        <div className="container grid grid-cols-1 md:grid-cols-[150px_150px_1fr] lg:grid-cols-[200px_200px_1fr] xl:grid-cols-[200px_200px_1fr_500px] gap-8">
          {/* Instagram Section */}
          <div className="flex flex-col">
            <p className="font-semibold text-xl">Instagram</p>

            {/* <InstagramLogoIcon className="w-8 h-8 mr-2" /> */}
            <Link
              href="https://www.instagram.com/rex_teria"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center mt-2 hover:text-primary transition-colors duration-300"
            >
              {/* <Avatar>
                <AvatarImage
                  src="https://instagram.flko13-1.fna.fbcdn.net/v/t51.2885-19/432336138_775596000784518_6021412784808401941_n.jpg?stp=dst-jpg_s150x150&_nc_ht=instagram.flko13-1.fna.fbcdn.net&_nc_cat=106&_nc_ohc=8tohqxMi3PIQ7kNvgENz02j&_nc_gid=d3e601ae7017485ea3b2499f1ee8489d&edm=AONqaaQBAAAA&ccb=7-5&oh=00_AYC85SDfw4fTybJIhaDARQr0bzxgbDksjjOa7lOJZiMINw&oe=66FB6AD9&_nc_sid=4e3341"
                  alt="Insta Profile"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar> */}
              <p className="overflow-hidden rounded-full h-12 w-12 mr-2">
                <Image
                  src={insta}
                  className="w-full h-full object-cover"
                  alt="insta profile pic"
                  width={100}
                  height={100}
                />
              </p>
              <p>
                <span className="text-lg">@rex_teria</span>
                <p className="text-sm text-gray-500">107k followers</p>
              </p>
            </Link>
          </div>

          {/* Quick Links Section */}
          <div>
            <p className="font-semibold text-xl">Quick Links</p>
            <div className="flex flex-col mt-2 space-y-1">
              {[
                "Home",
                "Categories",
                "Mods",
                "Our Customers",
                "Contact Us",
              ].map((link) => (
                <Link
                  key={link}
                  href={"/"}
                  className="hover:text-primary transition-colors duration-300"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories Section */}
          <div>
            <p className="font-semibold text-xl">Categories</p>
            <div className="grid grid-cols-2 gap-2">
              {categories?.map((cat) => (
                <Link
                  key={cat?._id}
                  href={`mods?category=${cat?._id}`}
                  className="my-1 hover:text-primary transition-colors duration-300 whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  {cat?.title}
                </Link>
              ))}
            </div>
          </div>

          {/* About Us Section */}
          <div className="rounded-lg md:col-span-3 lg:col-span-full xl:col-span-1 font-poppins text-base text-gray-400">
            <h4 className="text-lg font-semibold font-oxaniumd text-foreground">
              About Us
            </h4>
            <p className="text-sm mb-4">
              ModtopiaGTA5 is an e-commerce digital download mod selling website
              which is owned and managed by REXTERIA.
            </p>
            <p className="text-sm">
              For any queries, you can mail us at:
              <br />
              <a
                href="mailto:moddingguruji@outlook.com"
                className="hover:text-primary transition-colors duration-300"
              >
                moddingguruji@outlook.com
              </a>
            </p>
            <p className="text-sm">
              You can also contact me on my Instagram:
              <br />
              <a
                href="https://www.instagram.com/rex_teria"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors duration-300"
              >
                @rex_teria
              </a>
            </p>
          </div>
        </div>
        <Separator className="my-4 bg-primary" />
        <div className="container">
          <p>
            Copyright © 2024 REXTERIA |{" "}
            <Link href={"/"} className="hover:text-primary">
              Developed & Maintained By Vaibhav Maurya
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

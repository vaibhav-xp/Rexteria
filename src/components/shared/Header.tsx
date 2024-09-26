"use client";

import avatar from "@/assets/rexteria_insta.jpg";
import {
  Car,
  CassetteTape,
  ChevronDownIcon,
  Edit,
  Heart,
  History,
  HomeIcon,
  Info,
  LogOut,
  PuzzleIcon,
  ShoppingBagIcon,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { MdClose, MdMenu, MdOutlineShoppingBag } from "react-icons/md";
import { Drawer, DrawerContent, DrawerOverlay } from "../ui/drawer"; // Ensure DrawerOverlay is used for the background dim effect
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function Header() {
  const [drawer, setDrawer] = useState(false); // Default is closed
  const mail = "mauryaabc@gmail.com";

  const toggleDrawer = () => {
    setDrawer(!drawer);
  };

  return (
    <header className="bg-background border-b border-primary sticky top-0 z-50">
      {/* Header Top Bar */}
      <div className="border-b border-secondary w-full py-2">
        <div className="container flex justify-between items-center">
          <span className="flex gap-1">
            <span className="hidden md:block">Contact Us:</span>{" "}
            <Link href={`mailto:${mail}`} className="hover:text-primary">
              {mail}
            </Link>
          </span>
          <span className="flex gap-2 text-sm">
            <Link href="/" className="hover:text-primary">
              <FaYoutube />
            </Link>
            <Link href="/" className="hover:text-primary">
              <FaInstagram />
            </Link>
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div className="container flex justify-between items-center text-sm py-2">
        <Link href={"/"} className="text-xl md:text-2xl font-oxanium">
          REX<span className="text-primary font-bold">TERIA</span>
        </Link>

        <nav className="hidden md:flex items-center gap-4">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <Link href="/categories" className="hover:text-primary">
            Categories
          </Link>
          <Link href="/mods" className="hover:text-primary">
            Mods
          </Link>
          <Link href="/" className="hover:text-primary">
            About Us
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <p className="flex items-center gap-1 text-base md:text-lg text-primary cursor-pointer">
            <MdOutlineShoppingBag className="text-foreground" /> (0) &#8377;0.00
          </p>

          {/* Mobile Menu Toggle */}
          <button
            className="block md:hidden text-2xl focus:outline-none"
            onClick={toggleDrawer}
          >
            {drawer ? <MdClose /> : <MdMenu />}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger className="hidden md:flex items-center gap-2">
              <p className="w-8 h-8 overflow-hidden rounded-full">
                <Image
                  src={avatar}
                  width={60}
                  height={60}
                  alt="profile"
                  className="object-cover w-full h-full"
                />
              </p>
              <ChevronDownIcon className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-4">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2">
                <User className="w-4 h-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <ShoppingBagIcon className="w-4 h-4" /> Cart
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Heart className="w-4 h-4" /> Wishlist
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <History className="w-4 h-4" /> Orders
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Drawer for Mobile Navigation */}
      <Drawer open={drawer} onClose={toggleDrawer}>
        <DrawerOverlay onClick={toggleDrawer} />
        <DrawerContent className="px-4">
          <section className="py-8">
            {/* Profile Section */}
            <div className="flex gap-2 items-center relative">
              <p className="w-16 h-16 overflow-hidden rounded-full">
                <Image
                  src={avatar}
                  width={60}
                  height={60}
                  alt="profile"
                  className="object-cover w-full h-full"
                />
              </p>
              <p>
                <span className="text-xl">Vaibhav Maurya</span>
                <br />
                <span className="text-base text-gray-500">
                  vibhu.astute@gmail.com
                </span>
              </p>
              <Edit className="absolute top-0 right-2 hover:text-primary" />
            </div>

            {/* Drawer Links */}
            <nav className="mt-8 space-y-4 text-lg">
              <Link
                href="/"
                className="flex items-center gap-2 hover:text-primary"
                onClick={toggleDrawer}
              >
                <HomeIcon className="w-5 h-5" /> Home
              </Link>

              <Link
                href="/categories"
                className="flex items-center gap-2 hover:text-primary"
                onClick={toggleDrawer}
              >
                <CassetteTape className="w-5 h-5" /> Categories
              </Link>

              <Link
                href="/mods"
                className="flex items-center gap-2 hover:text-primary"
                onClick={toggleDrawer}
              >
                <Car className="w-5 h-5" /> Mods
              </Link>

              <Link
                href="/cart"
                className="flex items-center gap-2 hover:text-primary"
                onClick={toggleDrawer}
              >
                <ShoppingBagIcon className="w-5 h-5" /> Cart
              </Link>

              <Link
                href="/wishlist"
                className="flex items-center gap-2 hover:text-primary"
                onClick={toggleDrawer}
              >
                <Heart className="w-5 h-5" /> Wishlist
              </Link>

              <Link
                href="/orders"
                className="flex items-center gap-2 hover:text-primary"
                onClick={toggleDrawer}
              >
                <History className="w-5 h-5" /> Wishlist
              </Link>

              <Link
                href="/about"
                className=" flex items-center gap-2 hover:text-primary"
                onClick={toggleDrawer}
              >
                <Info className="w-5 h-5" /> About Us
              </Link>
              <Link
                href="/about"
                className=" flex items-center gap-2 hover:text-primary"
                onClick={toggleDrawer}
              >
                <LogOut className="w-5 h-5" /> Logout
              </Link>
            </nav>
          </section>
        </DrawerContent>
      </Drawer>
    </header>
  );
}

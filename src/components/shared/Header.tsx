"use client";

import useStore from "@/hooks/use-store";
import {
  drowpdown,
  navlinkMobAfterLogin,
  navlinkMobBeforeLogin,
  navLinks,
  placeHolderImage,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, Edit, LogIn, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { MdClose, MdMenu, MdOutlineShoppingBag } from "react-icons/md";
import { Button } from "../ui/button";
import { Drawer, DrawerContent, DrawerOverlay } from "../ui/drawer";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function Header() {
  const { cartItems, totalAmount } = useStore();
  const router = useRouter();
  const { user, logout } = useStore();
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);
  const mail = "rexteria8999@gmail.com";
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
            <Link
              href="https://www.youtube.com/c/Rexteria"
              className="hover:text-primary"
            >
              <FaYoutube />
            </Link>
            <Link
              href="https://www.instagram.com/rex_teria"
              className="hover:text-primary"
            >
              <FaInstagram />
            </Link>
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div className="container flex justify-between items-center text-sm py-2">
        <Link href={"/"} className={cn("text-xl md:text-2xl font-oxanium")}>
          REX<span className="text-primary font-bold">TERIA</span>
        </Link>

        <nav className="hidden md:flex items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link?.href}
              href={link.href}
              className={cn(
                "hover:text-primary",
                pathname === link.href && "text-primary",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <Link
              href={"/cart"}
              className="flex items-center gap-1 text-base md:text-lg text-primary"
            >
              <MdOutlineShoppingBag className="text-foreground" /> (
              {cartItems?.length}) &#8377;{totalAmount || 0}
            </Link>
          ) : (
            <Button onClick={() => router.push("/login")} variant={"default"}>
              Login
            </Button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="block md:hidden text-2xl focus:outline-none"
            onClick={toggleDrawer}
          >
            {drawer ? <MdClose /> : <MdMenu />}
          </button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="hidden md:flex items-center gap-2">
                <p className="w-8 h-8 overflow-hidden rounded-full">
                  <Image
                    src={
                      (user?.avatar?.url as string) ||
                      placeHolderImage(user?.name)
                    }
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
                {drowpdown.map((link) => (
                  <DropdownMenuItem key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-2",
                        pathname === link.href && "text-primary",
                      )}
                    >
                      <link.icon className="w-4 h-4" /> {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem>
                  <Link
                    href={pathname}
                    className={cn("flex items-center gap-2")}
                    onClick={() => logout().then(() => router.push("/"))}
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Drawer for Mobile Navigation */}
      <Drawer open={drawer} onClose={toggleDrawer}>
        <DrawerOverlay onClick={toggleDrawer} />
        <DrawerContent className="px-4">
          <section className="py-8">
            {/* Profile Section */}
            {user && (
              <div className="flex gap-2 items-center relative">
                <p className="w-16 h-16 overflow-hidden rounded-full">
                  <Image
                    src={
                      (user?.avatar?.url as string) ||
                      placeHolderImage(user?.name)
                    }
                    width={200}
                    height={200}
                    alt="profile"
                    className="object-cover w-full h-full"
                  />
                </p>
                <p>
                  {user?.name && <span className="text-xl">{user?.name}</span>}
                  <br />
                  <span className="text-base text-gray-500">{user?.email}</span>
                </p>
                <Edit
                  className="absolute top-0 right-2 hover:text-primary cursor-pointer"
                  onClick={() => {
                    router.push("/profile");
                    toggleDrawer();
                  }}
                />
              </div>
            )}

            {/* Drawer Links */}
            <nav className="mt-8 space-y-4 text-lg">
              {(user ? navlinkMobAfterLogin : navlinkMobBeforeLogin).map(
                (link) => {
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-2 hover:text-primary",
                        pathname === link.href && "text-primary",
                      )}
                      onClick={toggleDrawer}
                    >
                      <link.icon className="w-5 h-5" /> {link.label}
                    </Link>
                  );
                },
              )}
              {user ? (
                <Link
                  href={"/"}
                  className={cn("flex items-center gap-2 hover:text-primary")}
                  onClick={() => logout().then(() => toggleDrawer())}
                >
                  <LogOut className="w-5 h-5" /> Logout
                </Link>
              ) : (
                <Link
                  href={"/login"}
                  className={cn(
                    "flex items-center gap-2 hover:text-primary",
                    pathname === "login" && "text-primary",
                  )}
                  onClick={toggleDrawer}
                >
                  <LogIn className="w-5 h-5" /> Login
                </Link>
              )}
            </nav>
          </section>
        </DrawerContent>
      </Drawer>
    </header>
  );
}

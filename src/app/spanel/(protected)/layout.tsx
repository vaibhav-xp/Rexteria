"use client";

import Sidebar from "@/components/spanel/Sidebar";
import {
  BadgeHelp,
  Car,
  ChartBarStacked,
  ChevronLeft,
  Contact,
  GalleryThumbnails,
  History,
  LayoutDashboard,
  LogIn,
  StarIcon,
  User,
} from "lucide-react";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="flex gap-4 h-screen overflow-hidden w-full">
      <Sidebar
        links={[
          {
            title: "Dashboard",
            href: "/spanel",
            icon: LayoutDashboard,
            variant: "ghost",
          },
          {
            title: "Category",
            href: "/spanel/category",
            icon: ChartBarStacked,
            variant: "ghost",
          },
          {
            title: "Mods",
            href: "/spanel/mods",
            icon: Car,
            variant: "ghost",
          },
          {
            title: "Gallery",
            href: "/spanel/gallery",
            icon: GalleryThumbnails,
            variant: "ghost",
          },
          {
            title: "Users",
            href: "/spanel/users",
            icon: User,
            variant: "ghost",
          },
          {
            title: "Reviews",
            href: "/spanel/reviews",
            icon: StarIcon,
            variant: "ghost",
          },
          {
            title: "OTPs",
            href: "/spanel/otp",
            icon: LogIn,
            variant: "ghost",
          },
          {
            title: "Enquiry",
            href: "/spanel/enquiry",
            icon: BadgeHelp,
            variant: "ghost",
          },
          {
            title: "History",
            href: "/spanel/history",
            icon: History,
            variant: "ghost",
          },
          {
            title: "Contact Us",
            href: "/spanel/contacts",
            icon: Contact,
            variant: "ghost",
          },
          {
            title: "Back",
            href: "/",
            icon: ChevronLeft,
            variant: "ghost",
          },
        ]}
      />
      <section className="p-8 w-full overflow-y-scroll">{children}</section>
    </main>
  );
}

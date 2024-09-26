/** @format */
"use client";

import { useState } from "react";

import {
  BadgeHelp,
  Car,
  ChartBarStacked,
  ChevronRight,
  GalleryThumbnails,
  LayoutDashboard,
  LogIn,
} from "lucide-react";

import { useWindowWidth } from "@react-hook/window-size";
import { Button } from "../ui/button";
import { Nav } from "../ui/nav";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 768;

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }

  return (
    <aside
      className={`relative transition-all duration-150 self-stretch ${
        mobileWidth ? "w-[80px]" : isCollapsed ? "w-[80px]" : "w-[200px]"
      } border-r px-3  pb-10 pt-24`}
    >
      {!mobileWidth && (
        <div className="absolute right-[-20px] top-7">
          <Button
            onClick={toggleSidebar}
            variant="secondary"
            className=" rounded-full p-2"
          >
            <ChevronRight />
          </Button>
        </div>
      )}

      <Nav
        isCollapsed={mobileWidth ? true : isCollapsed}
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
            title: "OTPs",
            href: "/spanel/otp",
            icon: LogIn,
            variant: "ghost",
          },
          {
            title: "Enquiry",
            href: "/spanel/equiry",
            icon: BadgeHelp,
            variant: "ghost",
          },
        ]}
      />
    </aside>
  );
}

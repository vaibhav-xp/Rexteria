"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, LucideIcon, LogOut } from "lucide-react";
import { useWindowWidth } from "@react-hook/window-size";
import { Button } from "../ui/button";
import { Nav } from "../ui/nav";
import { useRouter } from "next/navigation";

interface LinksType {
  title: string;
  label?: string;
  icon: LucideIcon;
  variant: "default" | "ghost";
  href: string;
}

export default function Sidebar({ links }: { links: LinksType[] }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 768;
  const router = useRouter();

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }

  const handleBackClick = () => {
    router.back();
  };

  return (
    <aside
      className={`relative transition-all duration-150 self-stretch ${
        mobileWidth ? "w-[80px]" : isCollapsed ? "w-[80px]" : "w-[200px]"
      } border-r px-3 pb-10 pt-24`}
    >
      {!mobileWidth && (
        <div className="absolute right-[-20px] top-7">
          <Button
            onClick={toggleSidebar}
            variant="secondary"
            className="rounded-full p-2"
          >
            <ChevronRight />
          </Button>
        </div>
      )}

      {/* Back Button */}
      <Nav isCollapsed={mobileWidth ? true : isCollapsed} links={links} />
    </aside>
  );
}

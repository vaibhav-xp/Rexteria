"use client";

import Sidebar from "@/components/spanel/Sidebar";
import { ChevronLeft, Heart, ShoppingBagIcon, User } from "lucide-react";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="flex gap-4 h-screen overflow-hidden w-full container px-0">
      <Sidebar
        links={[
          {
            title: "Profile",
            href: "/profile",
            icon: User,
            variant: "ghost",
          },
          {
            title: "Cart",
            href: "/cart",
            icon: ShoppingBagIcon,
            variant: "ghost",
          },
          {
            title: "Wishlist",
            href: "/wishlist",
            icon: Heart,
            variant: "ghost",
          },
          // {
          //   title: "Orders",
          //   href: "/orders",
          //   icon: History,
          //   variant: "ghost",
          // },
          {
            title: "Back",
            href: "/",
            icon: ChevronLeft,
            variant: "ghost",
          },
        ]}
      />
      <section className="pt-8 px-4 w-full overflow-y-scroll relative">
        {children}
      </section>
    </main>
  );
}

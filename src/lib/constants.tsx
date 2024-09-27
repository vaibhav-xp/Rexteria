import {
  Car,
  CassetteTape,
  Heart,
  History,
  HomeIcon,
  Info,
  LogOut,
  ShoppingBagIcon,
  User,
} from "lucide-react";

export const navLinks = [
  {
    href: "/",
    label: "Home",
    icon: HomeIcon,
  },
  {
    href: "/categories",
    label: "Categories",
    icon: CassetteTape,
  },
  {
    href: "/mods",
    label: "Mods",
    icon: Car,
  },
  {
    href: "/about",
    label: "About Us",
    icon: Info,
  },
];

export const drowpdown = [
  {
    href: "/profile",
    label: "Profile",
    icon: User,
  },
  {
    href: "/cart",
    label: "Cart",
    icon: ShoppingBagIcon,
  },
  {
    href: "/wishlist",
    label: "Wishlist",
    icon: Heart,
  },
  {
    href: "/orders",
    label: "Orders",
    icon: History,
  },
];

export const navlinkMobAfterLogin = [
  {
    href: "/",
    label: "Home",
    icon: HomeIcon,
  },
  {
    href: "/categories",
    label: "Categories",
    icon: CassetteTape,
  },
  {
    href: "/mods",
    label: "Mods",
    icon: Car,
  },
  {
    href: "/cart",
    label: "Cart",
    icon: ShoppingBagIcon,
  },
  {
    href: "/wishlist",
    label: "Wishlist",
    icon: Heart,
  },
  {
    href: "/orders",
    label: "Orders",
    icon: History,
  },
  {
    href: "/about",
    label: "About Us",
    icon: Info,
  },
];

export const navlinkMobBeforeLogin = [...navLinks];

export const placeHolderImage = (text?: string) => {
  return `https://placehold.co/100x100?text=${
    text
      ? text
          .split(" ")
          .slice(0, 2)
          .map((st) => st[0].toUpperCase())
          .join("")
      : "Hey!+Gamer"
  }`;
};
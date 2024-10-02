import {
  Car,
  CassetteTape,
  Heart,
  History,
  HomeIcon,
  Info,
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
    href: "/contact",
    label: "Contact Us",
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
    href: "/contact",
    label: "Contact Us",
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

export const displayViews = (views: number) => {
  if (views > 1000) {
    return `${(views / 1000).toFixed(views % 1000 === 0 ? 0 : 1)}k`;
  } else {
    return views;
  }
};

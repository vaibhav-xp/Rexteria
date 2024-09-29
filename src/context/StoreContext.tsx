"use client";

import { getCartFn } from "@/services/cart";
import { getCategoriesFn } from "@/services/category";
import { showAlert } from "@/services/handle-api";
import { logoutFn } from "@/services/login";
import { getUserFn } from "@/services/profile";
import { CartModType } from "@/types/cart-types";
import { DisplayCategoriesTypes } from "@/types/category-types";
import { UserType } from "@/types/store-types";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useEffect, useState } from "react";

interface StoreContextTypes {
  user: UserType | null;
  categories: DisplayCategoriesTypes[];
  isCategoriesLoading: boolean;
  refetchCategory: () => Promise<void>;
  refetchUser: () => Promise<void>;
  logout: () => Promise<void>;
  refetchCartData: () => Promise<void>;
  isCartLoading: boolean;
  totalAmount: number;
  cartItems: CartModType[];
}

export const StoreContext = createContext<StoreContextTypes | null>(null);

export default function StoreContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [categories, setCategories] = useState<DisplayCategoriesTypes[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartModType[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Fetch categories
  const refetchCategory = () =>
    getCategoriesFn()
      .then((data) => setCategories(data?.data))
      .finally(() => setIsCategoriesLoading(false));

  // Fetch user profile
  const refetchUser = () => getUserFn().then((data) => setUser(data?.data));

  // Logout function
  const logout = () =>
    logoutFn()
      .then((data) => showAlert(data))
      .then(() => router.push("/"))
      .then(() => setUser(null));

  // Fetch cart data
  const refetchCartData = () =>
    getCartFn()
      .then((data) => {
        setCartItems(data?.data?.mods || []);
        setTotalAmount(data?.data?.totalAmount.toFixed(0));
      })
      .finally(() => setIsCartLoading(false));

  // Initial load for categories and user
  useEffect(() => {
    refetchCategory();
    refetchUser();
  }, []);

  // Fetch cart data only when the user is present
  useEffect(() => {
    if (user) {
      refetchCartData();
    } else {
      setCartItems([]);
      setTotalAmount(0);
    }
  }, [user]);

  return (
    <StoreContext.Provider
      value={{
        user,
        categories,
        isCategoriesLoading,
        refetchCategory,
        refetchUser,
        logout,
        isCartLoading,
        cartItems,
        totalAmount,
        refetchCartData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

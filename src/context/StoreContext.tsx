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
import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from "react";

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
  const [onlyFirstTime, setOnlyFirstTime] = useState(true);

  const refetchCategory = useCallback(() => {
    setIsCategoriesLoading(true);
    return getCategoriesFn()
      .then((data) => setCategories(data?.data))
      .finally(() => setIsCategoriesLoading(false));
  }, []);

  const refetchUser = useCallback(() => {
    return getUserFn().then((data) => setUser(data?.data));
  }, []);

  const logout = useCallback(() => {
    return logoutFn()
      .then((data) => showAlert(data))
      .then(() => router.push("/"))
      .then(() => setUser(null));
  }, [router]);

  const refetchCartData = useCallback(async () => {
    return getCartFn()
      .then((data) => {
        setCartItems(data?.data?.mods || []);
        setTotalAmount(data?.data?.totalAmount.toFixed(0));
      })
      .finally(() => setIsCartLoading(false));
  }, []);

  useEffect(() => {
    refetchCategory();
    refetchUser();
  }, [refetchCategory, refetchUser]);

  useEffect(() => {
    if (user && onlyFirstTime) {
      refetchCartData();
      setOnlyFirstTime(false);
    }
  }, [user, refetchCartData, onlyFirstTime]);

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

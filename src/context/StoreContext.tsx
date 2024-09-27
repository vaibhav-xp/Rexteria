"use client";

import { getCategoriesFn } from "@/services/category";
import { showAlert } from "@/services/handle-api";
import { logoutFn } from "@/services/login";
import { getUserFn } from "@/services/profile";
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

  const refetchCategory = () =>
    getCategoriesFn()
      .then((data) => setCategories(data?.data))
      .finally(() => setIsCategoriesLoading(false));

  const refetchUser = () => getUserFn().then((data) => setUser(data?.data));

  const logout = () =>
    logoutFn()
      .then((data) => showAlert(data))
      .then(() => router.push("/"))
      .then(() => setUser(null));

  useEffect(() => {
    refetchCategory();
    refetchUser();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        user,
        categories,
        isCategoriesLoading,
        refetchCategory,
        refetchUser,
        logout,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

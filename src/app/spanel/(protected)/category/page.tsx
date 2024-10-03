"use client";

import NotFound from "@/components/shared/not-found";
import { AddUpdateCategory } from "@/components/spanel/Category/AddUpdate";
import CategoryCard from "@/components/spanel/Category/Card";
import { Button } from "@/components/ui/button";
import Title from "@/components/ui/title";
import useStore from "@/hooks/use-store";
import ShimmerCategoryCardPanel from "@/shimmer/Spanel/category-card-shimmer";
import { CategoryActionTypes } from "@/types/category-types";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export default function Category() {
  const [action, setAction] = useState<CategoryActionTypes | null>(null);
  const { categories, isCategoriesLoading, refetchCategory } = useStore();

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <Title title="Mod Category" />
        <Button variant="outline" onClick={() => setAction({ type: "add" })}>
          <PlusCircle size={18} className="mr-2" />
          Add New Category
        </Button>
        <AddUpdateCategory
          action={action}
          setAction={setAction}
          fetchData={refetchCategory}
        />
      </div>
      {isCategoriesLoading && <ShimmerCategoryCardPanel />}
      {!isCategoriesLoading && categories?.length !== 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories?.map((item) => (
            <CategoryCard
              key={item._id || item.title}
              data={item}
              fetchData={refetchCategory}
              openModal={() =>
                setAction({
                  type: "update",
                  data: item,
                })
              }
            />
          ))}
        </div>
      )}
      {!isCategoriesLoading && categories?.length === 0 && (
        <NotFound className="w-1/3 mx-auto" />
      )}
    </>
  );
}

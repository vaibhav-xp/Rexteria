"use client";

import LoadingSpinner from "@/components/shared/loading-spinner";
import NotFound from "@/components/shared/not-found";
import { AddUpdateCategory } from "@/components/spanel/Category/AddUpdate";
import CategoryCard from "@/components/spanel/Category/Card";
import { Button } from "@/components/ui/button";
import Title from "@/components/ui/title";
import { getCategoriesFn } from "@/services/category";
import {
  CategoryActionTypes,
  DisplayCategoriesTypes,
} from "@/types/category-types";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function Category() {
  const [action, setAction] = useState<CategoryActionTypes | null>(null);
  const [data, setData] = useState<DisplayCategoriesTypes[]>([]);
  const [isPending, setIsPending] = useState<boolean>(false);

  const fetchData: () => void = () => {
    setIsPending(true);
    getCategoriesFn()
      .then(({ data }) => {
        setData(data);
      })
      .then(() => setIsPending(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title title="Mod Category" />
        <Button variant="outline" onClick={() => setAction({ type: "add" })}>
          <PlusCircle size={18} className="mr-2" />
          Add New Category
        </Button>
        <AddUpdateCategory
          action={action}
          setAction={setAction}
          fetchData={fetchData}
        />
      </div>
      {isPending && <LoadingSpinner className="mx-auto mt-16" />}
      {!isPending && data?.length !== 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {data?.map((item) => (
            <CategoryCard
              key={item._id || item.title}
              data={item}
              fetchData={fetchData}
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
      {!isPending && data?.length === 0 && (
        <NotFound className="w-1/2 mx-auto" />
      )}
    </div>
  );
}

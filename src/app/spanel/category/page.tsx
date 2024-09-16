"use client";

import { AddUpdateCategory } from "@/components/spanel/Category/AddUpdate";
import CategoryCard from "@/components/spanel/Category/Card";
import Title from "@/components/ui/title";
import { getCategoriesFn } from "@/services/category";
import { useEffect, useState } from "react";

export default function Category() {
  const [data, setData] = useState([]);

  const fetchData = () => getCategoriesFn().then(({ data }) => setData(data));

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title title="Mod Category" />
        <AddUpdateCategory fetchData={fetchData} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {data?.map((item) => <CategoryCard data={item} />)}
      </div>
    </div>
  );
}

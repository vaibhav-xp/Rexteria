"use client";

import { getPublicModsFn } from "@/services/mod";
import { ModType } from "@/types/mod-types";
import { useEffect, useState } from "react";
import Title from "../ui/title";
import ModCard from "../mods/ModCard";
import ShimmerModCard from "@/shimmer/Mods/mod-card-shimmer";
import Link from "next/link";

export default function TopRatingMods() {
  const [mods, setMods] = useState<ModType[]>([]);
  const [loading, setLoading] = useState(true);

  const getMods = () => {
    setLoading(true);
    getPublicModsFn({
      limit: 7,
      page: 1,
      sortField: "rating",
    })
      .then((data) => {
        setMods(data?.data?.mods);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getMods();
  }, []);

  return (
    <div className="container my-10">
      <Title title="Top Rating Mods" className="text-2xl mb-4" />
      <>
        {loading ? (
          <ShimmerModCard cardLength={8} />
        ) : (
          mods.length && (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {mods.map((mod) => (
                <ModCard key={mod._id} mod={mod} />
              ))}
              <div className="relative overflow-hidden group">
                <div className="overflow-hidden w-full h-full rounded-lg bg-indigo-600 flex items-center justify-center brightness-50 group transition-all duration-200 hover:brightness-90">
                  <Link
                    href={"/mods"}
                    className="text-white text-3xl font-bold tracking-wide transition-transform duration-500 transform translate-y-0 group-hover:-translate-y-3"
                  >
                    Show All
                  </Link>
                </div>
              </div>
            </div>
          )
        )}
      </>
    </div>
  );
}

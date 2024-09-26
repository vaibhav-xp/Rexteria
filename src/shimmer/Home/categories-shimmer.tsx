import { Skeleton } from "@/components/ui/skeleton";
import { ShimmerCardsTypes } from "@/types/shimmer-types";
import { useWindowWidth } from "@react-hook/window-size";
import { useEffect, useState } from "react";

export default function ShimmerCategoriesHome() {
  const initialCards = {
    count: 2,
    basis: "basis-1/2",
  };

  const [cards, setCards] = useState<ShimmerCardsTypes>(initialCards);
  const onlyWidth = useWindowWidth();

  useEffect(() => {
    if (onlyWidth >= 1024) {
      setCards({
        count: 6,
        basis: "basis-1/6",
      });
    } else if (onlyWidth >= 768) {
      setCards({
        count: 4,
        basis: "basis-1/4",
      });
    } else {
      setCards(initialCards);
    }
  }, [onlyWidth]);

  return (
    <div className="flex gap-4">
      {Array.from({ length: cards.count }).map((_, index) => (
        <Skeleton className={`aspect-square w-full h-full ${cards.basis}`} />
      ))}
    </div>
  );
}

export function ShimmerCategoryPage() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {Array.from({ length: 10 }, (_, index) => (
        <Skeleton key={index} className={`aspect-square w-full h-[200px]`} />
      ))}
    </div>
  );
}

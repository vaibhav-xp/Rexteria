import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ShimmerCardsTypes } from "@/types/shimmer-types";
import { useWindowWidth } from "@react-hook/window-size";
import { useEffect, useMemo, useState } from "react";

export default function ShimmerModDetails() {
  const initialCards = useMemo(
    () => ({
      count: 4,
      basis: "basis-1/4",
    }),
    [],
  );
  const [cards, setCards] = useState<ShimmerCardsTypes>(initialCards);
  const onlyWidth = useWindowWidth();

  useEffect(() => {
    if (onlyWidth >= 768) {
      setCards({
        count: 4,
        basis: "basis-1/4",
      });
    } else if (onlyWidth >= 640) {
      setCards({
        count: 2,
        basis: "basis-1/2",
      });
    } else {
      setCards(initialCards);
    }
  }, [onlyWidth, initialCards]);

  return (
    <div className="container py-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <Skeleton className="w-20 h-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/mods">
              <Skeleton className="w-20 h-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/mods`}>
              <Skeleton className="w-20 h-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem className="hidden md:block">
            <Skeleton className="w-20 h-4" />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid grid-cols-1 lg:grid-cols-[60%_1fr] my-4 gap-4">
        <div className="space-y-4">
          <Skeleton className="w-full aspect-video" />
          <div className={`flex gap-4`}>
            {Array.from({ length: cards.count }, (_, index) => (
              <Skeleton
                key={index}
                className={cn("w-full aspect-video", cards.basis)}
              />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-20 h-4" />
          </div>
          <Skeleton className="w-full h-8" />
          <div className="flex gap-2">
            <Skeleton className="w-12 h-4" />
            <Skeleton className="w-20 h-4" />
          </div>
          <div className="flex gap-2 items-baseline">
            <Skeleton className="w-12 h-8" />
            <Skeleton className="w-20 h-4" />
          </div>
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-24 h-8" />
          <Table>
            <TableBody>
              {Array.from({ length: 4 }, (_, idx) => (
                <TableRow key={idx} className="text-sm">
                  <TableCell>
                    <Skeleton className="w-24 h-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-24 h-4" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Skeleton className="w-[200px] h-8" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
          </div>
          <Skeleton className="w-full h-[500px]" />
        </div>
      </div>
    </div>
  );
}

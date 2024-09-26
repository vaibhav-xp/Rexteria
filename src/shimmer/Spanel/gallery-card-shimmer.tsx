import { Skeleton } from "@/components/ui/skeleton";

export default function ShimmerGalleryCard() {
  return (
    <div className="grid grid-cols-4 mt-4  w-full h-full gap-4">
      {Array.from({ length: 10 }, (_, index) => (
        <Skeleton key={index} className="w-full h-[300px]" />
      ))}
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function CartShimmer() {
  return (
    <div className="mt-4 overflow-y-scroll">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="rounded-lg overflow-hidden w-full">
            <Skeleton className="w-full h-48" />
            <div className="px-4 space-y-4 pt-4">
              <Skeleton className="w-full h-8" />
              <div className="flex justify-between">
                <Skeleton className="w-36 h-4" />
                <Skeleton className="w-20 h-4" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="w-36 h-8" />
                <div className="flex gap-4">
                  <Skeleton className="w-8 h-8" />
                  <Skeleton className="w-4 h-8" />
                  <Skeleton className="w-8 h-8" />
                </div>
              </div>
              <div className="flex justify-between">
                <Skeleton className="w-[100px] h-8" />
                <Skeleton className="w-20 h-8" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

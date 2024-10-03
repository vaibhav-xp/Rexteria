import { Skeleton } from "@/components/ui/skeleton";

export default function ShimmerCategoryCardPanel() {
  return (
    <div className="grid grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className={`overflow-hidden rounded-lg`}>
          <Skeleton className="w-full h-48" />
          <div className="p-4 space-y-3">
            <Skeleton className="w-20 h-4" />
            <div className="flex items-center gap-4">
              <Skeleton className="w-20 h-6 my-2" />
              <Skeleton className="w-20 h-6 my-2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

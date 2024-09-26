import { Skeleton } from "@/components/ui/skeleton";

export default function ShimmerModCard({
  cardLength,
}: {
  cardLength?: number;
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full h-[100vh]">
      {Array.from({ length: cardLength || 10 }).map((_, index) => (
        <div key={index} className={`h-[250px] overflow-hidden rounded-lg`}>
          <Skeleton className="w-full h-40" />
          <Skeleton className="w-20 h-4 mx-auto my-2" />
          <Skeleton className="w-32 h-6 mx-auto my-2" />
          <Skeleton className="w-24 h-4 mx-auto my-2" />
        </div>
      ))}
    </div>
  );
}

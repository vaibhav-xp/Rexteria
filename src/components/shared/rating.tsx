import { cn } from "@/lib/utils";
import { IoStarHalf, IoStarOutline, IoStarSharp } from "react-icons/io5";

export default function Rating({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  return (
    <p className={cn("flex justify-center gap-1", className)}>
      {Array.from({ length: 5 }, (_, index) => (
        <>
          {rating >= index + 1 ? (
            <IoStarSharp key={index} className="text-primary" />
          ) : rating >= index + 0.5 ? (
            <IoStarHalf key={index} className="text-primary" />
          ) : (
            <IoStarOutline key={index} className="text-gray-600" />
          )}
        </>
      ))}
    </p>
  );
}

import { cn } from "@/lib/utils";
import { IoStarSharp } from "react-icons/io5";

export default function Rating({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  const ratingRound = Math.round(rating);
  return (
    <p className={cn("flex justify-center gap-1", className)}>
      {new Array(ratingRound).fill(0).map((_, idx) => (
        <IoStarSharp key={idx} className="text-primary" />
      ))}
      {new Array(5 - ratingRound).fill(0).map((_, idx) => (
        <IoStarSharp key={idx} />
      ))}
    </p>
  );
}

import { IoStarSharp } from "react-icons/io5";

export default function Rating({ rating }: { rating: number }) {
  const ratingRound = Math.round(rating);
  return (
    <p className="flex justify-center gap-1">
      {new Array(ratingRound).fill(0).map((_, idx) => (
        <IoStarSharp key={idx} className="text-primary" />
      ))}
      {new Array(5 - ratingRound).fill(0).map((_, idx) => (
        <IoStarSharp key={idx} />
      ))}
    </p>
  );
}

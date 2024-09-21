import img from "@/assets/not-found.svg";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
  className?: string;
}

export default function NotFound({ className }: Props) {
  return (
    <div
      className={cn(
        "w-full h-full flex flex-col justify-center items-center text-center",
        className,
      )}
    >
      <Image
        src={img}
        width={800}
        height={400}
        alt="Not Found"
        className="mx-auto"
      />
    </div>
  );
}

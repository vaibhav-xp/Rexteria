import Rating from "@/components/shared/rating";
import { displayViews } from "@/lib/constants";
import { ModType } from "@/types/mod-types";
import Image from "next/image";
import Link from "next/link";

export default function DisplayModSection({
  title,
  items,
}: {
  title: string;
  items: ModType[];
}) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {items?.map((item: ModType) => (
          <Link key={item._id} href={`/mods/${item.slug}`} className="h-full">
            <div className="bg-card rounded-lg p-4 border shadow-md transition-transform duration-200 hover:scale-105 h-full">
              <h3 className="text-lg font-bold text-ellipsis w-full overflow-hidden whitespace-nowrap">
                {item.title}
              </h3>
              <p className="text-sm">
                {(item.rating && (
                  <Rating rating={item.rating} className="justify-start" />
                )) ||
                  `${displayViews(item.views)} Views`}
              </p>
              <p className="overflow-hidden h-36">
                <Image
                  width={400}
                  height={400}
                  src={item.main_image?.url}
                  alt={item.title}
                  className="w-full h-full object-cover mt-2 rounded-lg"
                />
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

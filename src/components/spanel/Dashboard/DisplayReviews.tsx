import Rating from "@/components/shared/rating";
import { ModType } from "@/types/mod-types";
import { ReviewType } from "@/types/review-types";
import { UserType } from "@/types/store-types";
import { ThumbsUp } from "lucide-react";
import Image from "next/image";

export default function ReviewSection({
  title,
  items,
}: {
  title: string;
  items: ReviewType[];
}) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <ul className="space-y-2">
        {items?.map((item) => (
          <li
            key={item._id}
            className="bg-card flex gap-4 rounded-lg p-4 border shadow-md hover:scale-105 duration-200"
          >
            <p className="w-20 h-20 overflow-hidden rounded-md">
              <Image
                src={(item?.mod_id as ModType).main_image?.url}
                width={200}
                height={200}
                alt={(item?.mod_id as ModType).title}
                className="w-full h-full object-cover"
              />
            </p>
            <div>
              <p>
                <strong>
                  {(item?.user_id as UserType)?.name || "Anonymous"}
                </strong>
                ({(item?.user_id as UserType).email})
              </p>
              <p className="text-sm">
                Created At: {new Date(item.createdAt).toLocaleString()}
              </p>
              <Rating rating={item?.rating} className="justify-start" />
              {item?.likes && <ThumbsUp size={14} className="mt-1" />}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

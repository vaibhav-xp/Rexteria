import { placeHolderImage } from "@/lib/constants";
import StatusDisplay, { EnquiryType } from "@/types/enquiry-types";
import { UserType } from "@/types/store-types";
import Image from "next/image";

export default function DisplayEnquirySection({
  title,
  items,
}: {
  title: string;
  items: EnquiryType[];
}) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <ul className="grid grid-cols-1 gap-4">
        {items?.map((item: EnquiryType) => (
          <li
            key={item._id}
            className="bg-card flex gap-4 rounded-lg p-4 border shadow-md hover:scale-105 duration-200"
          >
            <p className="w-20 h-20 overflow-hidden rounded-md">
              <Image
                src={
                  (item.user_id as UserType)?.avatar?.url ||
                  placeHolderImage((item.user_id as UserType).name)
                }
                width={200}
                height={200}
                alt={(item.user_id as UserType)?.name}
                className="w-full h-full object-cover"
              />
            </p>
            <div className="flex-grow">
              <p>
                <strong>{(item.user_id as UserType)?.name}</strong>(
                {(item?.user_id as UserType)?.email})
              </p>
              <p className="text-sm">
                Created At: {new Date(item?.createdAt).toLocaleString()}
              </p>
              <div className="flex justify-between w-full">
                <p className="text-xl text-primary">₹{item?.pitchPrice}</p>
                <StatusDisplay status={item?.status} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

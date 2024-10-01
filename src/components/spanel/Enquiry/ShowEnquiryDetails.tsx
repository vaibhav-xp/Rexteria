import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { placeHolderImage } from "@/lib/constants";
import { postEnquiryStatusFn } from "@/services/enquiry";
import { showAlert } from "@/services/handle-api";
import StatusDisplay, { EnquiryType } from "@/types/enquiry-types";
import { ModType } from "@/types/mod-types";
import { UserType } from "@/types/store-types";
import { Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";
import { MdVisibility } from "react-icons/md";

export default function ShowEnquiryDetails({
  enquiry,
  setEnquiry,
  isOrderPage = false,
  refetchEnquries,
}: {
  enquiry: EnquiryType;
  isOrderPage?: boolean;
  setEnquiry: Dispatch<SetStateAction<EnquiryType | null>>;
  refetchEnquries?: () => Promise<void>;
}) {
  const [status, setStatus] = useState(enquiry?.status as string);
  const mods = enquiry?.mods;
  const user = enquiry?.user_id as UserType;

  const handleChange = (value: string) => {
    const formData = new FormData();
    formData.append("status", value);
    formData.append("enquiry_id", enquiry?._id);
    postEnquiryStatusFn(formData)
      .then((data) => showAlert(data))
      .then(() => {
        setStatus(value);
        if (refetchEnquries) refetchEnquries();
        setEnquiry(null);
      });
  };
  return (
    <Dialog open={!!enquiry} onOpenChange={() => setEnquiry(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Enquiry Details</DialogTitle>
          <DialogDescription>
            To buy mods send an enquiry, and we will get back to you.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 w-full">
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <Image
              src={user?.avatar?.url || placeHolderImage(user?.name)}
              width={200}
              height={200}
              alt={user?.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-grow relative">
            <p>{user?.name}</p>
            <p className="text-sm text-gray-300">{user?.email}</p>
            <p className="text-sm text-gray-300">{user?.phone}</p>
            <div className="flex flex-col items-end absolute right-2 top-2 gap-2">
              <Link href={user?.instagram}>
                <Instagram size={18} />
              </Link>
              {!isOrderPage && <StatusDisplay status={enquiry?.status} />}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-2 w-full bg-card p-2 rounded-xl">
          {mods?.map((item) => {
            const mod = item?.mod_id as ModType;
            return (
              <div key={mod?.slug} className="grid grid-cols-[80px_1fr] gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden">
                  <Image
                    src={mod?.main_image?.url}
                    alt={mod?.title}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="w-[200px] text-ellipsis whitespace-nowrap overflow-hidden">
                    {mod?.title}
                  </p>
                  <div className="flex justify-between">
                    <p>
                      ₹{mod?.discount_price} x {item?.quantity}
                    </p>
                    <p className="text-primary">
                      ₹{mod?.discount_price * item?.quantity}
                    </p>
                  </div>
                  <p>
                    <Link href={`/mods/${mod?.slug}`} target="_blank">
                      <MdVisibility size={20} className="hover:text-primary" />
                    </Link>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {enquiry?.message && (
          <div className="mt-4">
            <p className="text-lg font-bold">Message:</p>
            <p className="font-poppins bg-card p-4 rounded-md max-w-[460px] mt-2 overflow-hidden">
              {enquiry?.message}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">
            Total Amount: ₹{enquiry?.pitchPrice}
          </div>
          {isOrderPage ? (
            <StatusDisplay status={enquiry?.status} />
          ) : (
            <div>
              <Select value={status} onValueChange={handleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"review"}>In Review</SelectItem>
                  <SelectItem value={"hold"}>On Hold</SelectItem>
                  <SelectItem value={"completed"}>Successfully</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

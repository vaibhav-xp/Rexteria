"use client";

import CartCard from "@/components/cart/CartCard";
import NotFound from "@/components/shared/not-found";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import Title from "@/components/ui/title";
import useStore from "@/hooks/use-store";
import { postEnquiryFn } from "@/services/enquiry";
import { showAlert } from "@/services/handle-api";
import CartShimmer from "@/shimmer/cart-shimmer";
import { ModType } from "@/types/mod-types";
import { DialogTitle } from "@radix-ui/react-dialog";
import Image from "next/image";
import { useMemo, useState } from "react";

export default function Cart() {
  const { user } = useStore();
  const { cartItems, totalAmount, refetchCartData, isCartLoading } = useStore();
  const [sendEnquiryLoading, setSendEnquiryLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [checkbox, setCheckbox] = useState(false);
  const [dialog, setDialog] = useState(false);
  const buyWhenProfileComplete = useMemo(() => {
    if (
      user?.name &&
      user?.country &&
      user?.instagram &&
      user?.phone &&
      user?.email
    )
      return true;
    return false;
  }, [user]);

  const handleCheckboxChange = () => {
    setCheckbox(!checkbox);
  };

  const handleDialogBox = () => setDialog(!dialog);

  const handleEnquiry = () => {
    const enquiry = {
      mods: cartItems?.map((item) => item?.mod_id as ModType),
      pitchPrice: totalAmount,
      ...(message && { message }),
    };
    setSendEnquiryLoading(true);
    postEnquiryFn(enquiry)
      .then((data) => showAlert(data))
      .then(() => refetchCartData())
      .then(() => handleDialogBox())
      .finally(() => setSendEnquiryLoading(true));
  };

  return (
    <>
      <Title title="Cart" />
      <div className="grid grid-rows-[calc(100vh-210px)_1fr] md:grid-rows-[calc(100vh-180px)_1fr] grid-cols-1">
        {!isCartLoading && cartItems?.length > 0 && (
          <div className="mt-4 overflow-y-scroll">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cartItems.map((cart, index) => (
                <CartCard
                  key={index}
                  cart={cart}
                  getCartData={refetchCartData}
                />
              ))}
            </div>
          </div>
        )}
        {isCartLoading && <CartShimmer />}
        {!isCartLoading && cartItems.length === 0 && <NotFound />}
        {totalAmount > 0 && (
          <div className="p-4 rounded-lg bg-card mt-4 mr-1">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-xl font-bold">
                Total Amount: ₹{totalAmount}
              </div>
              <Button
                className="mt-4 md:mt-0 w-full md:w-auto"
                onClick={handleDialogBox}
              >
                Buy Now
              </Button>
            </div>
          </div>
        )}
      </div>
      <Dialog open={dialog} onOpenChange={handleDialogBox}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Send Enquiry</DialogTitle>
            <DialogDescription>
              To buy mods send enquiry to we will read to you.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 max-h-[250px] overflow-y-scroll pr-2">
            {cartItems.map((item) => {
              const mod = item?.mod_id as ModType;
              return (
                <div
                  key={mod?.slug}
                  className="grid grid-cols-[80px_1fr] gap-4"
                >
                  <p className="w-20 h-20 rounded-lg overflow-hidden">
                    <Image
                      src={mod?.main_image?.url}
                      alt={mod?.title}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </p>
                  <div>
                    <p className="w-[200px] text-ellipsis whitespace-nowrap overflow-hidden">
                      {mod?.title}
                    </p>
                    <div className="flex justify-between">
                      <p>
                        ₹{mod?.discount_price} * {item?.quantity}
                      </p>
                      <p className="text-primary">
                        ₹{mod?.discount_price * item?.quantity}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p></p>
                  </div>
                </div>
              );
            })}
          </div>
          <div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-card w-full rounded-sm outline-none focus-within:outline-none p-2 font-poppins"
              placeholder="message..."
            />
          </div>
          <div className="space-x-2 flex bg-card p-4 rounded-sm">
            <Checkbox
              id={"enquiry"}
              checked={checkbox}
              onCheckedChange={handleCheckboxChange}
            />
            <label htmlFor="enquiry" className="flex-shrink text-red-500">
              Note: This enquiry will be sent to the administrator, who will
              reach out to you shortly to proceed with the next steps of
              purchasing. Please ensure your profile is complete before
              submitting. Currently, payments are handled manually due to
              certain reasons, and we do not support automated payments at this
              time.
            </label>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-xl font-bold">
              Total Amount: ₹{totalAmount}
            </div>
            <Button
              disabled={!checkbox}
              className="mt-4 md:mt-0 w-full md:w-auto"
              onClick={handleEnquiry}
            >
              {buyWhenProfileComplete
                ? sendEnquiryLoading
                  ? "Sending..."
                  : "Send Enquiry"
                : "Complete Your Profile"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import NotFound from "@/components/shared/not-found";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import Title from "@/components/ui/title";
import { getEnquiryFn } from "@/services/enquiry";
import StatusDisplay, { EnquiryType } from "@/types/enquiry-types";
import { ModType } from "@/types/mod-types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdVisibility } from "react-icons/md";

export default function Orders() {
  const [loading, setLoading] = useState(true);
  const [enquiries, setEnquiries] = useState<EnquiryType[]>([]);

  useEffect(() => {
    getEnquiryFn()
      .then((data) => setEnquiries(data?.data))
      .then(() => setLoading(false));
  }, []);

  return (
    <>
      <Title title="Order History" />
      {!loading && (
        <div className="mt-4">
          <Accordion type="single" collapsible className="space-y-4">
            {enquiries.map((order) => {
              const mods = order?.mods;
              return (
                <AccordionItem
                  key={order?._id}
                  value={order?._id}
                  className="bg-card rounded-xl px-4 py-2 hover:no-underline"
                >
                  <AccordionTrigger>
                    <div className="flex justify-between w-full pr-8">
                      <div className="font-poppins text-left space-y-1">
                        <p className="no-underline font-bold">
                          Order Id: {order?._id}
                        </p>
                        <p className="text-sm">
                          Date: {order?.createdAt.slice(0, 10)}
                        </p>
                        <p className="text-xl text-primary !font-oxanium">
                          ₹{order?.pitchPrice.toFixed(0)}
                        </p>
                      </div>
                      <StatusDisplay status={order?.status} />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 border rounded-lg bg-background grid gap-4 grid-cols-1  lg:grid-cols-2 xl:grid-cols-3">
                    {mods.map((modItem) => {
                      const mod = modItem?.mod_id as ModType;
                      return (
                        <div
                          key={mod?._id}
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
                            <p>
                              ₹ {mod?.discount_price} * {modItem?.quantity}
                            </p>
                            <p className="text-primary">
                              ₹{modItem?.price * modItem?.quantity}
                            </p>
                            <Link target="_blank" href={`/mods/${mod?.slug}`}>
                              <MdVisibility size={20} />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      )}
      {loading && (
        <div className="space-y-4 mt-4">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-28 w-full" />
          ))}
        </div>
      )}
      {!loading && enquiries.length === 0 && (
        <NotFound className="mx-auto w-1/2" />
      )}
    </>
  );
}

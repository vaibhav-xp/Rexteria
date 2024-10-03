import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { ModType } from "./mod-types";
import { UserType } from "./store-types";

export interface EnquiryModsType {
  mod_id: string | ModType;
  price: number;
  totalAmount: number;
  quantity: number;
}

export enum EnquiryStatus {
  review = "review",
  hold = "hold",
  completed = "completed",
}

export interface EnquiryType {
  _id: string;
  user_id: string | UserType;
  mods: EnquiryModsType[];
  message: string;
  pitchPrice: number;
  status: EnquiryStatus;
  createdAt: string;
}

export default function StatusDisplay({ status }: { status: EnquiryStatus }) {
  const statusMap = useMemo(
    () => ({
      hold: {
        variant: "destructive" as const,
        label: "On hold",
      },
      review: {
        variant: "secondary" as const,
        label: "In review",
      },
      completed: {
        variant: "default" as const,
        label: "Successful",
      },
    }),
    [],
  );

  const { variant, label } = statusMap[status] || statusMap.completed;

  return (
    <Button variant={variant} className="rounded-full" disabled>
      {label}
    </Button>
  );
}

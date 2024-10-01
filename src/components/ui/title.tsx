/** @format */

import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  title: string;
  className?: string;
};

export default function Title({ title, className }: Props) {
  return (
    <h1 className={cn("text-4xl font-semibold text-primary", className)}>
      {title}
    </h1>
  );
}

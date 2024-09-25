"use client";

import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditSepecificationPropsTypes } from "@/types/mod-types";
import { MinusCircle, PlusCircle } from "lucide-react";
import React, { ChangeEvent } from "react";

export default function EditSepecification({
  specifications,
  setSpecifications,
}: EditSepecificationPropsTypes) {
  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    field: "type" | "value"
  ) => {
    const newSpecifications = [...specifications];
    newSpecifications[index] = {
      ...newSpecifications[index],
      [field]: e.target.value,
    };
    setSpecifications(newSpecifications);
  };

  const handleAddSpecification = () => {
    setSpecifications([...specifications, { type: "", value: "" }]);
  };

  const handleRemoveSpecification = (index: number) => {
    const newSpecifications = specifications.filter(
      (_, specIndex) => specIndex !== index
    );
    setSpecifications(newSpecifications);
  };

  return (
    <div className="w-full">
      <FormLabel>Specifications</FormLabel>
      {specifications?.length > 0 && (
        <div className="grid grid-cols-1 gap-4 mt-4">
          {specifications.map((spec, index) => (
            <div key={index} className="grid grid-cols-[1fr_1fr_50px] gap-2">
              <Input
                value={spec.type}
                onChange={(e) => handleOnChange(e, index, "type")}
                placeholder="Type"
              />
              <Input
                value={spec.value}
                onChange={(e) => handleOnChange(e, index, "value")}
                placeholder="Value"
              />
              <Button
                variant={"outline"}
                type="button"
                onClick={() => handleRemoveSpecification(index)}
              >
                <MinusCircle className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant={"outline"}
        onClick={handleAddSpecification}
        className="w-full mt-4"
      >
        <PlusCircle className="w-4 h-4" />
      </Button>
    </div>
  );
}

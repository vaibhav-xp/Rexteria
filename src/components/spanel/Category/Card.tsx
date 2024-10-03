import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import useCarousal from "@/hooks/use-carousal";
import { deleteCategoryByIdFn } from "@/services/category";
import { showAlert } from "@/services/handle-api";
import { DisplayCategoriesTypes } from "@/types/category-types";
import { Edit, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function CategoryCard({
  data,
  openModal,
  fetchData,
}: {
  data: DisplayCategoriesTypes;
  openModal: () => void;
  fetchData: () => Promise<void>;
}) {
  const { image, title } = data;
  const { handleSetImages } = useCarousal();
  const [loader, setLoader] = useState(false);

  const handelDelete = () => {
    setLoader(true);
    const formData = new FormData();
    formData.append("_id", data?._id);
    deleteCategoryByIdFn(formData)
      .then((data) => showAlert(data))
      .then(() => fetchData())
      .finally(() => setLoader(false));
  };

  return (
    <Card className="overflow-hidden shadow-md transition-all hover:shadow-lg rounded-lg">
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={image?.url || ""}
          alt={title}
          width={500}
          height={500}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 cursor-pointer"
          onClick={() => handleSetImages([image?.url], 0)}
        />
      </div>
      <CardContent className="p-4">
        <CardTitle className="text-xl font-semibold mb-2">{title}</CardTitle>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
            onClick={openModal}
          >
            <Edit size={16} /> Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="flex items-center gap-2"
            onClick={handelDelete}
          >
            <Trash size={16} />
            {loader ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

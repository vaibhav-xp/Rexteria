import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Edit, Trash } from "lucide-react";
import Image from "next/image";

// Define types for data props if needed
interface CategoryData {
  image?: {
    url: string;
    publid_id: string;
  };
  title: string;
}

interface CategoryCardProps {
  data: CategoryData;
}

export default function CategoryCard({ data }: CategoryCardProps) {
  const { image, title } = data;

  return (
    <Card className="overflow-hidden shadow-md transition-all hover:shadow-lg rounded-lg">
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={image?.url || ""}
          alt={title}
          width={500}
          height={500}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <CardTitle className="text-xl font-semibold mb-2">{title}</CardTitle>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <Edit size={16} /> Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Trash size={16} /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import DisplayModImages from "@/components/mods/DisplayModImages";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getModBySlugFn } from "@/services/mod";
import { ModType } from "@/types/mod-types";
import { Car, HomeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Table } from "@/components/ui/table";
import {
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import Rating from "@/components/shared/rating";
import { MdVisibility } from "react-icons/md";

export default function SingleModShow({ params }: { params: { _id: string } }) {
  const [mod, setMod] = useState<ModType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMod = async () => {
      try {
        const data = await getModBySlugFn(params._id);
        setMod(data?.data);
      } catch (error) {
        console.error("Error fetching mod:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMod();
  }, [params._id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!mod) {
    return <p>Mod not found.</p>;
  }

  return (
    <div className="container py-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex gap-1">
              <HomeIcon className="w-4 h-4" /> Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/mods" className="flex gap-1">
              <Car className="w-4 h-4" /> Mods
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{mod.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_40%] my-4 gap-4">
        <DisplayModImages images={[mod.main_image, ...mod.images]} />
        <div>
          <div className="flex justify-between items-center font-poppins">
            <Rating rating={mod.rating} className="justify-start mb-2" />
            <p className="flex gap-1 items-center">
              <MdVisibility className="text-primary" />
              <span className="text-xs">{mod.views}</span>
            </p>
          </div>
          <h1 className="text-2xl font-bold">{mod.title}</h1>
          <div className="my-2">
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold text-green-600">
                ₹{mod.discount_price.toFixed(0)}
              </span>
              {mod.discount > 0 && (
                <p className="text-sm text-gray-500 line-through ml-2">
                  ₹{mod.price.toFixed(2)}
                </p>
              )}
            </div>
            {mod.discount > 0 && (
              <p className="text-sm text-gray-500">Discount: {mod.discount}%</p>
            )}
          </div>
          <div className="mt-4">
            <h2 className="text-base font-semibold">Specifications</h2>
            <Table>
              <TableBody>
                {mod.specifications.map((spec) => (
                  <TableRow key={spec.type} className="text-sm">
                    <TableCell>{spec.type}</TableCell>
                    <TableCell>{spec.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-8">
            <h4 className="text-base font-semibold">Description:</h4>
            <p
              className="mt-4 text-sm text-gray-400 font-poppins"
              dangerouslySetInnerHTML={{ __html: mod?.content }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

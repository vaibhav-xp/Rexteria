"use client";

import NotFound from "@/components/shared/not-found";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Title from "@/components/ui/title";
import useCarousal from "@/hooks/use-carousal";
import useStore from "@/hooks/use-store";
import { displayViews } from "@/lib/constants";
import { showAlert } from "@/services/handle-api";
import { deleteModsFn, getModsFn, statusModsFn } from "@/services/mod";
import ShimmerTableBody from "@/shimmer/Spanel/table-shimmer";
import { ModType } from "@/types/mod-types";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdVisibility } from "react-icons/md";

export default function Mods() {
  const router = useRouter();
  const { categories } = useStore();
  const [loading, setLoading] = useState(true);
  const [mods, setMods] = useState<ModType[]>([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMods, setTotalMods] = useState(0);
  const [totalPage, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  const { handleSetImages } = useCarousal();

  const getMods = () => {
    setLoading(true);
    getModsFn({
      search,
      limit: itemsPerPage,
      page: currentPage,
      categoryId: categoryId === "all" ? "" : categoryId,
    })
      .then((data) => {
        setCurrentPage(data?.data?.page);
        setTotalMods(data?.data?.totalMods);
        setMods(data?.data?.mods);
        setTotalPages(data?.data?.totalPages);
      })
      .finally(() => setLoading(false));
  };

  const handleStatus = (_id: string) => {
    const formData = new FormData();
    formData.append("mod_id", _id);
    statusModsFn(formData)
      .then((data) => showAlert(data))
      .then(() => getMods());
  };

  useEffect(() => {
    const timer = setTimeout(() => getMods(), 500);
    return () => clearTimeout(timer);
  }, [search, currentPage, categoryId]);

  const handleDelete = (_id: string) => {
    deleteModsFn({ mod_id: _id })
      .then((data) => showAlert(data))
      .then(() => getMods());
  };

  const handleEdit = (_id: string) => {
    router.push(`/spanel/mods/update/${_id}`);
  };

  return (
    <>
      <Title title="Mods" />
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4 items-center w-[600px]">
          <Input
            type="text"
            placeholder="Search by title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded w-full lg:w-[400px] my-4"
          />
          <Select
            defaultValue={categoryId}
            onValueChange={(value) => setCategoryId(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"all"}>All</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/spanel/mods/add")}
        >
          <PlusCircle size={18} className="mr-2" />
          Add New Mod
        </Button>
      </div>
      <div className="overflow-x-auto w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="text-center text-lg">Title</TableCell>
              <TableCell className="text-center text-lg">Main Image</TableCell>
              <TableCell className="text-center text-lg">Price (INR)</TableCell>
              <TableCell className="text-center text-lg">
                Discount (%)
              </TableCell>
              <TableCell className="text-center text-lg">Category</TableCell>
              <TableCell className="text-center text-lg">Rating</TableCell>
              <TableCell className="text-center text-lg">Rated By</TableCell>
              <TableCell className="text-center text-lg">Views</TableCell>
              <TableCell className="text-center text-lg">Status</TableCell>
              <TableCell className="text-center text-lg">Images</TableCell>
              <TableCell className="text-center text-lg">Actions</TableCell>
              <TableCell className="text-center text-lg">
                View On Website
              </TableCell>
            </TableRow>
          </TableHeader>
          {loading && <ShimmerTableBody row={10} coloumn={12} />}
          {!loading && mods.length === 0 && (
            <TableBody>
              <TableRow>
                <TableCell className="min-h-[500px]" colSpan={11}>
                  <NotFound className="w-1/3 mx-auto" />
                </TableCell>
              </TableRow>
            </TableBody>
          )}

          {!loading &&
            mods.map((mod: ModType) => (
              <TableBody>
                <TableRow key={mod._id}>
                  <TableCell>
                    <p className="w-[250px] mx-auto text-center overflow-hidden whitespace-nowrap text-ellipsis ">
                      {mod.title}
                    </p>
                  </TableCell>

                  <TableCell className="text-center">
                    <Image
                      src={mod?.main_image?.url}
                      alt={mod.title}
                      width={200}
                      height={200}
                      style={{
                        width: "80px",
                        height: "50px",
                        objectFit: "cover",
                        margin: "0 auto",
                      }}
                    />
                  </TableCell>
                  <TableCell className="text-center">{mod.price}</TableCell>
                  <TableCell className="text-center">{mod.discount}</TableCell>
                  <TableCell className="text-center">
                    {mod?.categoryId?.title}
                  </TableCell>
                  <TableCell className="text-center">{mod.rating}</TableCell>
                  <TableCell className="text-center">
                    {mod.reviewCount}
                  </TableCell>
                  <TableCell className="text-center">
                    {displayViews(mod.views)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={mod.status}
                      onCheckedChange={() => handleStatus(mod._id)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      className="text-primary hover:underline"
                      onClick={() => {
                        const images = mod.images.map((img) => img.url);
                        handleSetImages([mod?.main_image?.url, ...images], 0);
                      }}
                    >
                      View All
                    </button>
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      className="text-blue-500 hover:underline mr-2"
                      onClick={() => handleEdit(mod._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDelete(mod._id)}
                    >
                      Delete
                    </button>
                  </TableCell>
                  <TableCell>
                    <Link target="_blank" href={`/mods/${mod.slug}`}>
                      <MdVisibility className="w-6 h-6 mx-auto" />
                    </Link>
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
          <TableFooter>
            <TableRow>
              <TableCell colSpan={11}>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        className={`cursor-pointer ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() =>
                          currentPage > 1 && setCurrentPage(currentPage - 1)
                        }
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPage }, (_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          className={`cursor-pointer ${currentPage === index + 1 ? "font-bold" : ""}`}
                          onClick={() => setCurrentPage(index + 1)}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        className={`cursor-pointer ${currentPage === totalPage ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() =>
                          currentPage < totalPage &&
                          setCurrentPage(currentPage + 1)
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </TableCell>
              <TableCell className="text-right">
                {mods.length} of {totalMods} Mods
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  );
}

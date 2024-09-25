"use client";

import { getCategoriesFn } from "@/services/category";
import { getPublicModsFn } from "@/services/mod";
import { DisplayCategoriesTypes } from "@/types/category-types";
import { ModType } from "@/types/mod-types";
import { useEffect, useState } from "react";
import LoadingSpinner from "../shared/loading-spinner";
import NotFound from "../shared/not-found";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import ModCard from "./ModCard";

export default function ModsListing() {
  const [loading, setLoading] = useState(false);
  const [mods, setMods] = useState<ModType[]>([]);
  const [categoryId, setCategoryId] = useState("all");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<DisplayCategoriesTypes[]>([]);
  const [sortOrder, setSortOrder] = useState("");
  const [sortField, setSortField] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPages] = useState(1);

  const getMods = () => {
    setLoading(true);
    getPublicModsFn({
      limit: 20,
      page: currentPage,
      search,
      sortOrder,
      sortField,
      categoryId: categoryId === "all" ? "" : categoryId,
    })
      .then((data) => {
        setCurrentPage(data?.data?.page);
        setMods(data?.data?.mods);
        setTotalPages(data?.data?.totalPages);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getCategoriesFn().then((data) => setCategories(data?.data));
  }, []);

  useEffect(() => {
    getMods();
  }, [search, categoryId, sortOrder, sortField, currentPage]);

  // Track screen size to determine if it's mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="container mx-auto px-4 my-8">
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        {/* Sidebar or Filter Popup Trigger */}
        {isMobile ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"outline"}>Filter</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filter</DialogTitle>
                <DialogDescription>
                  Apply filters to narrow down results
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-6 items-center overflow-auto">
                <Input
                  type="text"
                  placeholder="Search by title"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full p-3 rounded-lg shadow-sm focus:outline-none focus:border-primary"
                />
                <Select
                  defaultValue={categoryId}
                  onValueChange={(value) => setCategoryId(value)}
                >
                  <SelectTrigger className="w-full">
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

                <Select
                  defaultValue="createdAt"
                  onValueChange={(value) => setSortField(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Newest</SelectItem>
                    <SelectItem value="views">Most Views</SelectItem>
                    <SelectItem value="rating">Highest Rating</SelectItem>
                    <SelectItem value="ratingAndViews">
                      Best Rating & Views
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  defaultValue="desc"
                  onValueChange={(value) => setSortOrder(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <div className="flex flex-col gap-6 items-center overflow-auto">
            <Input
              type="text"
              placeholder="Search by title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 rounded-lg shadow-sm focus:outline-none focus:border-primary"
            />
            <Select
              defaultValue={categoryId}
              onValueChange={(value) => setCategoryId(value)}
            >
              <SelectTrigger className="w-full">
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

            <Select
              defaultValue="createdAt"
              onValueChange={(value) => setSortField(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Newest</SelectItem>
                <SelectItem value="views">Most Views</SelectItem>
                <SelectItem value="rating">Highest Rating</SelectItem>
                <SelectItem value="ratingAndViews">
                  Best Rating & Views
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              defaultValue="desc"
              onValueChange={(value) => setSortOrder(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
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
                <PaginationItem>
                  <PaginationNext
                    className={`cursor-pointer ${currentPage === totalPage ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() =>
                      currentPage < totalPage && setCurrentPage(currentPage + 1)
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Mods Display */}
        <div>
          {loading ? (
            <LoadingSpinner className="mx-auto mt-16" />
          ) : (
            <>
              {mods?.length === 0 ? (
                <NotFound className="w-1/2 mx-auto" />
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-4">
                    {mods.map((mod) => (
                      <ModCard key={mod?._id} mod={mod} />
                    ))}
                  </div>
                  <Pagination className="md:hidden">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          className={`cursor-pointer ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                          onClick={() =>
                            currentPage > 1 && setCurrentPage(currentPage - 1)
                          }
                        />
                      </PaginationItem>
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
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

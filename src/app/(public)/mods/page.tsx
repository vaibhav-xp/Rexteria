"use client";
import Banner from "@/components/mods/Banner";
import ModCard from "@/components/mods/ModCard";
import NotFound from "@/components/shared/not-found";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
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
import { getCategoriesFn } from "@/services/category";
import { getPublicModsFn } from "@/services/mod";
import ShimmerModCard from "@/shimmer/Mods/mod-card-shimmer";
import { DisplayCategoriesTypes } from "@/types/category-types";
import { ModType } from "@/types/mod-types";
import { Car, HomeIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ModsListing() {
  const params = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [mods, setMods] = useState<ModType[]>([]);
  const [categoryId, setCategoryId] = useState("all");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<DisplayCategoriesTypes[]>([]);
  const [sortOrder, setSortOrder] = useState("");
  const [sortField, setSortField] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPages] = useState(1);

  const getMods = useCallback(() => {
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
  }, [currentPage, search, sortOrder, sortField, categoryId]);

  useEffect(() => {
    getCategoriesFn().then((data) => setCategories(data?.data));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => getMods(), 500);
    return () => clearTimeout(timer);
  }, [search, categoryId, sortOrder, sortField, currentPage, getMods]);

  useEffect(() => {
    if (params.get("category")) setCategoryId(params.get("category") as string);
  }, [params]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const updateCategory = (value: string) => {
    setCategoryId(value);
    const newParams = new URLSearchParams(window.location.search);
    newParams.set("category", value);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${newParams}`,
    );
  };

  return (
    <section>
      <Banner />
      <div className="container my-8">
        <Breadcrumb className="my-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex gap-1">
                <HomeIcon className="w-4 h-4" /> Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex gap-1">
                <Car className="w-4 h-4" /> Mods
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {categories.find((cat) => cat._id === categoryId)?.title ||
                  "All"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
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
                  <Select value={categoryId} onValueChange={updateCategory}>
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
              <Select value={categoryId} onValueChange={updateCategory}>
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
                        currentPage < totalPage &&
                        setCurrentPage(currentPage + 1)
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {/* Mods Display */}
          <>
            {loading ? (
              <ShimmerModCard />
            ) : mods.length ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {mods.map((mod) => (
                  <ModCard key={mod._id} mod={mod} />
                ))}
              </div>
            ) : (
              <NotFound className="w-1/3 mx-auto" />
            )}
          </>
        </div>
      </div>
    </section>
  );
}

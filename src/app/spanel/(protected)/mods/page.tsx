"use client";

import sample from "@/assets/bg-mods.webp";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination"; // Import the shadcn pagination component
import { Switch } from "@/components/ui/switch"; // Import the shadcn switch component
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Title from "@/components/ui/title";
import useCarousal from "@/hooks/use-carousal";
import Image from "next/image";
import { useState } from "react";

// Dummy data for mods
const dummyMods = [
  {
    _id: "mod001",
    title: "Mod 1",
    slug: "mod-1",
    specification: "Spec for mod 1",
    main_image: sample,
    images: [sample, sample],
    categoryId: { name: "Category 1" },
    subcategoryId: { name: "Subcategory 1" },
    price: 100,
    discount: 10,
    rating: 4.5,
    views: 1500,
    reviews: ["review001", "review002"],
    status: true, // Active by default
  },
  {
    _id: "mod002",
    title: "Mod 2",
    slug: "mod-2",
    specification: "Spec for mod 2",
    main_image: sample,
    images: [sample, sample],
    categoryId: { name: "Category 2" },
    subcategoryId: { name: "Subcategory 2" },
    price: 150,
    discount: 20,
    rating: 4.0,
    views: 2500,
    reviews: ["review003", "review004"],
    status: false, // Disabled by default
  },
  {
    _id: "mod003",
    title: "Mod 3",
    slug: "mod-3",
    specification: "Spec for mod 3",
    main_image: sample,
    images: [sample, sample],
    categoryId: { name: "Category 3" },
    subcategoryId: { name: "Subcategory 3" },
    price: 200,
    discount: 30,
    rating: 4.8,
    views: 3500,
    reviews: ["review005", "review006"],
    status: true, // Active by default
  },
  // Add more items for demonstration purposes
];

export default function Mods() {
  const [mods, setMods] = useState(dummyMods);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { handleSetImages } = useCarousal();

  const handleStatusToggle = (id) => {
    setMods((prevMods) =>
      prevMods.map((mod) =>
        mod._id === id ? { ...mod, status: !mod.status } : mod,
      ),
    );
  };

  const handleEdit = (id) => {
    console.log(`Edit mod with id: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete mod with id: ${id}`);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const filteredMods = mods.filter((mod) =>
    mod.title.toLowerCase().includes(search.toLowerCase()),
  );

  const paginatedMods = filteredMods.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <>
      <Title title="Mods" />
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search by title"
          value={search}
          onChange={handleSearch}
          className="p-2 border rounded w-full lg:w-[300px] my-4"
        />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Title</TableHead>
              <TableHead className="text-center">Main Image</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="text-center">Subcategory</TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-center">Discount</TableHead>
              <TableHead className="text-center">Rating</TableHead>
              <TableHead className="text-center">Views</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Images</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMods.map((mod) => (
              <TableRow key={mod._id}>
                <TableCell className="text-center">{mod.title}</TableCell>
                <TableCell className="text-center">
                  <Image
                    src={mod.main_image}
                    alt={mod.title}
                    style={{
                      width: "80px",
                      height: "50px",
                      objectFit: "cover",
                      margin: "0 auto",
                    }}
                  />
                </TableCell>
                <TableCell className="text-center">
                  {mod.categoryId.name}
                </TableCell>
                <TableCell className="text-center">
                  {mod.subcategoryId.name}
                </TableCell>
                <TableCell className="text-center">${mod.price}</TableCell>
                <TableCell className="text-center">{mod.discount}%</TableCell>
                <TableCell className="text-center">{mod.rating}</TableCell>
                <TableCell className="text-center">{mod.views}</TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={mod.status}
                    onCheckedChange={() => handleStatusToggle(mod._id)}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <button
                    className="text-primary hover:underline"
                    onClick={() =>
                      handleSetImages([mod.main_image, ...mod.images])
                    }
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
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={11}>
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredMods.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </TableCell>
              <TableCell className="text-right">
                {paginatedMods.length} of {filteredMods.length} Mods
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  );
}

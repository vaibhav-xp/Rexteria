"use client";

import NotFound from "@/components/shared/not-found";
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
import { placeHolderImage } from "@/lib/constants";
import { showAlert } from "@/services/handle-api";
import { getAllUsersFn, postUsersStatusFn } from "@/services/profile";
import ShimmerTableBody from "@/shimmer/Spanel/table-shimmer";
import { UserType } from "@/types/store-types";
import { Instagram, XIcon, YoutubeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function UsersList() {
  const { handleSetImages } = useCarousal();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("all");
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);

  const getUsers = useCallback(() => {
    getAllUsersFn({
      search,
      page,
      limit: 10,
      active: active === "all" ? "" : active,
    }).then((data) => {
      setUsers(data?.data?.users);
      setPage(data?.data?.page);
      setTotalPages(data?.data?.totalPages);
      setLoading(false);
    });
  }, [active, page, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      getUsers();
    }, 500);

    return () => clearTimeout(timer);
  }, [search, page, active, getUsers]);

  const handleStatus = (_id: string) => {
    const formData = new FormData();
    formData.append("user_id", _id);
    postUsersStatusFn(formData)
      .then((data) => showAlert(data))
      .then(() => getUsers());
  };

  return (
    <>
      <Title title="Users" />
      <div className="flex gap-4 items-center w-[400px]">
        <Input
          type="text"
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-full lg:w-[400px] my-4"
        />
        <Select
          defaultValue={active}
          onValueChange={(value) => setActive(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Not Active</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-scroll w-full">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableCell className="text-center text-lg">Id</TableCell>
              <TableCell className="text-center text-lg">Image</TableCell>
              <TableCell className="text-center text-lg">Name</TableCell>
              <TableCell className="text-center text-lg">Email</TableCell>
              <TableCell className="text-center text-lg">Country</TableCell>
              <TableCell className="text-center text-lg">Phone</TableCell>
              <TableCell className="text-center text-lg">Instagram</TableCell>
              <TableCell className="text-center text-lg">Youtube</TableCell>
              <TableCell className="text-center text-lg">Twitter</TableCell>
              <TableCell className="text-center text-lg">Status</TableCell>
            </TableRow>
          </TableHeader>
          {loading && <ShimmerTableBody row={10} coloumn={10} />}
          {!loading && users.length === 0 && (
            <TableBody>
              <TableRow>
                <TableCell className="min-h-[500px]" colSpan={10}>
                  <NotFound className="w-1/3 mx-auto" />
                </TableCell>
              </TableRow>
            </TableBody>
          )}

          {!loading &&
            users.map((user) => (
              <TableBody key={user?._id}>
                <TableRow>
                  <TableCell className="text-center">{user?._id}</TableCell>
                  <TableCell className="text-center">
                    <p className="w-16 h-16 overflow-hidden rounded-full">
                      <Image
                        src={user?.avatar?.url || placeHolderImage(user?.name)}
                        alt={user?.name}
                        width={50}
                        height={50}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() =>
                          handleSetImages([
                            user?.avatar?.url || placeHolderImage(user?.name),
                          ])
                        }
                      />
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    <p className="overflow-hidden whitespace-nowrap text-ellipsis">
                      {user?.name || "--"}
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    {user?.email || "--"}
                  </TableCell>
                  <TableCell className="text-center">
                    {user?.country || "--"}
                  </TableCell>
                  <TableCell className="text-center">
                    {user?.phone ? (
                      <Link
                        target="_blank"
                        href={`https://api.whatsapp.com/send?phone=${user?.phone}`}
                      >
                        {user?.phone}
                      </Link>
                    ) : (
                      "--"
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {user?.instagram ? (
                      <a
                        href={user.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Instagram className="text-2xl mx-auto" />
                      </a>
                    ) : (
                      "--"
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {user?.youtube ? (
                      <a
                        href={user.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <YoutubeIcon className="text-2xl mx-auto" />
                      </a>
                    ) : (
                      "--"
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {user?.x ? (
                      <a
                        href={user.x}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <XIcon className="text-2xl mx-auto" />
                      </a>
                    ) : (
                      "--"
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={user?.active}
                      onCheckedChange={() => handleStatus(user?._id)}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
          <TableFooter>
            <TableRow>
              <TableCell colSpan={9}>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        className={`cursor-pointer ${page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => page > 1 && setPage(page - 1)}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          className={`cursor-pointer ${page === index + 1 ? "font-bold" : ""}`}
                          onClick={() => setPage(index + 1)}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        className={`cursor-pointer ${page === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => page < totalPages && setPage(page + 1)}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </TableCell>
              <TableCell className="text-right">
                {page} of {totalPages} Users
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  );
}

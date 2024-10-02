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
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Title from "@/components/ui/title";
import { getOtpFn } from "@/services/login";
import ShimmerTableBody from "@/shimmer/Spanel/table-shimmer";
import { useEffect, useState } from "react";

interface OTP {
  _id: string;
  email: string;
  createdAt: string;
}

export default function OTPList() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [otps, setOtps] = useState<OTP[]>([]);
  const [totalOtps, setTotalOtps] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      getOtpFn({
        search,
        page,
        limit: 10,
      })
        .then((data) => {
          setPage(data?.data?.page);
          setTotalPages(data?.data?.totalPages);
          setOtps(data?.data?.otps);
          setTotalOtps(data?.data?.totalOTPs);
        })
        .finally(() => setLoading(false));
    }, 500);

    return () => clearTimeout(timer);
  }, [search, page]);

  return (
    <>
      <Title title="OTPs" />
      <div>
        <Input
          type="text"
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-full lg:w-[400px] my-4"
        />
      </div>
      <div className="overflow-x-auto w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="text-center text-lg">ID</TableCell>
              <TableCell className="text-center text-lg">Email</TableCell>
              <TableCell className="text-center text-lg">Created At</TableCell>
              <TableCell className="text-center text-lg">Time</TableCell>
            </TableRow>
          </TableHeader>
          {loading && <ShimmerTableBody row={5} coloumn={4} />}
          {!loading && otps.length === 0 && (
            <TableBody>
              <TableRow>
                <TableCell className="min-h-[500px]" colSpan={11}>
                  <NotFound className="w-1/3 mx-auto" />
                </TableCell>
              </TableRow>
            </TableBody>
          )}

          {!loading &&
            otps.map((otp) => {
              const date = new Date(otp?.createdAt);
              return (
                <TableBody key={otp?._id}>
                  <TableRow key={otp?._id}>
                    <TableCell className="text-center">{otp?._id}</TableCell>
                    <TableCell className="text-center">{otp?.email}</TableCell>
                    <TableCell className="text-center">
                      {date.toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center">
                      {date.toLocaleTimeString().slice(0, 5)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              );
            })}
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>
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
                {otps.length} of {totalOtps} Mods
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  );
}

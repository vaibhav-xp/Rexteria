"use client";

import NotFound from "@/components/shared/not-found";
import ShowEnquiryDetails from "@/components/spanel/Enquiry/ShowEnquiryDetails";
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
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Title from "@/components/ui/title";
import { cn } from "@/lib/utils";
import { historyFn } from "@/services/enquiry";
import ShimmerTableBody from "@/shimmer/Spanel/table-shimmer";
import StatusDisplay, { EnquiryType } from "@/types/enquiry-types";
import { UserType } from "@/types/store-types";
import { Instagram } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function Histor() {
  const [enquiries, setEnquiries] = useState<EnquiryType[]>([]);
  const [search, setSearch] = useState("");
  const [searchById, setSearchById] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalEnquiries, setTotalEnquiries] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [enquiry, setEnquiry] = useState<EnquiryType | null>(null);

  const fetchEnquiry = useCallback(
    () =>
      historyFn({
        search,
        page: currentPage,
        ...(searchById.length === 24 && { searchById }),
      })
        .then((data) => {
          setEnquiries(data?.data?.enquiries || []);
          setTotalPages(data?.data?.totalPages || 0);
          setTotalEnquiries(data?.data?.totalEnquiries || 0);
        })
        .finally(() => setLoading(false)),
    [search, currentPage, searchById],
  );

  useEffect(() => {
    fetchEnquiry();
  }, [fetchEnquiry]);

  return (
    <>
      <Title title="History" />
      <div className="flex gap-4 items-center w-[600px]">
        <Input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-full lg:w-[400px] my-4"
        />
        <Input
          type="text"
          placeholder="Search by Order Id (24 characters)"
          value={searchById}
          onChange={(e) => setSearchById(e.target.value)}
          className={cn(
            "p-2 border rounded w-full lg:w-[400px] my-4",
            searchById.length !== 24 && "text-destructive",
          )}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell className="text-center text-lg">Order ID</TableCell>
            <TableCell className="text-center text-lg">Name</TableCell>
            <TableCell className="text-center text-lg">Email</TableCell>
            <TableCell className="text-center text-lg">Phone</TableCell>
            <TableCell className="text-center text-lg">Instagram</TableCell>
            <TableCell className="text-center text-lg">Price</TableCell>
            <TableCell className="text-center text-lg">Created At</TableCell>
            <TableCell className="text-center text-lg">Status</TableCell>
            <TableCell className="text-center text-lg">View Details</TableCell>
          </TableRow>
        </TableHeader>
        {loading && <ShimmerTableBody row={10} coloumn={9} />}
        {!loading && enquiries.length === 0 && (
          <TableBody>
            <TableRow>
              <TableCell className="min-h-[500px]" colSpan={9}>
                <NotFound className="w-1/3 mx-auto" />
              </TableCell>
            </TableRow>
          </TableBody>
        )}
        {enquiries.length !== 0 && !loading && (
          <TableBody>
            {enquiries.map((enq) => {
              const user = enq?.user_id as UserType;
              return (
                <TableRow key={enq?._id}>
                  <TableCell className="text-center">{enq?._id}</TableCell>
                  <TableCell className="text-center">{user?.name}</TableCell>
                  <TableCell className="text-center">{user?.email}</TableCell>
                  <TableCell className="text-center">{user?.phone}</TableCell>
                  <TableCell className="text-center">
                    <a
                      href={user?.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram className="text-2xl mx-auto" />
                    </a>
                  </TableCell>
                  <TableCell className="text-center">
                    {enq?.pitchPrice}
                  </TableCell>
                  <TableCell className="text-center">
                    {enq?.createdAt?.slice(0, 10)}
                  </TableCell>
                  <TableCell className="grid place-content-center">
                    <StatusDisplay status={enq?.status} />
                  </TableCell>
                  <TableCell className="text-center">
                    <Button onClick={() => setEnquiry(enq)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        )}
        <TableFooter>
          <TableRow>
            <TableCell colSpan={8}>
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
                  {Array.from({ length: totalPages }, (_, index) => (
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
                      className={`cursor-pointer ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() =>
                        currentPage < totalPages &&
                        setCurrentPage(currentPage + 1)
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </TableCell>
            <TableCell className="text-right">
              {enquiries.length} of {totalEnquiries} Enquiries
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      {enquiry && (
        <ShowEnquiryDetails
          enquiry={enquiry as EnquiryType}
          setEnquiry={setEnquiry}
          isOrderPage={true}
        />
      )}
    </>
  );
}

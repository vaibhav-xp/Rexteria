"use client";

import NotFound from "@/components/shared/not-found";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
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
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import Title from "@/components/ui/title";
import {
  deleteContactFn,
  getContactFn,
  patchContactFn,
} from "@/services/contact";
import { showAlert } from "@/services/handle-api";
import ShimmerTableBody from "@/shimmer/Spanel/table-shimmer";
import { ContactType } from "@/types/contact-typest";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Instagram, Trash } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function ContactUs() {
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [dialog, setDialog] = useState<ContactType | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalContacts, setTotalContacts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const getContacts = useCallback(() => {
    getContactFn({
      page,
      limit: 10,
      search,
    }).then((data) => {
      setContacts(data?.data?.contacts);
      setPage(data?.data?.page);
      setTotalPages(data?.data?.totalPages);
      setTotalContacts(data?.data?.totalContacts);
      setIsLoading(false);
    });
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      getContacts();
    }, 500);
    return () => clearTimeout(timer);
  }, [getContacts]);

  const handleStatus = (status: string, contact_id: string) => {
    const formData = new FormData();
    formData.append("status", status);
    formData.append("contact_id", contact_id);
    patchContactFn(formData)
      .then((data) => showAlert(data))
      .then(() => getContacts());
  };

  const handleDelete = (contact_id: string) => {
    const formData = new FormData();
    formData.append("contact_id", contact_id);
    deleteContactFn(formData)
      .then((data) => showAlert(data))
      .then(() => getContacts());
  };

  return (
    <div>
      <Title title="Contact Us" />
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
              <TableCell className="text-center text-lg">Name</TableCell>
              <TableCell className="text-center text-lg">Email</TableCell>
              <TableCell className="text-center text-lg">Phone</TableCell>
              <TableCell className="text-center text-lg">Instagram</TableCell>
              <TableCell className="text-center text-lg">Subject</TableCell>
              <TableCell className="text-center text-lg">Status</TableCell>
              <TableCell className="text-center text-lg">Created At</TableCell>
              <TableCell className="text-center text-lg">Action</TableCell>
              <TableCell className="text-center text-lg">View</TableCell>
            </TableRow>
          </TableHeader>
          {isLoading && <ShimmerTableBody row={5} coloumn={9} />}
          {!isLoading && (
            <TableBody>
              {contacts.length === 0 && (
                <TableRow>
                  <TableCell className="min-h-[500px]" colSpan={9}>
                    <NotFound className="w-1/3 mx-auto" />
                  </TableCell>
                </TableRow>
              )}
              {contacts.map((contact) => {
                const date = new Date(contact.createdAt);
                return (
                  <TableRow key={contact._id}>
                    <TableCell className="text-center">
                      {contact.name}
                    </TableCell>
                    <TableCell className="text-center">
                      {contact.email}
                    </TableCell>
                    <TableCell className="text-center">
                      {contact.phone || "--"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Link
                        href={contact.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Instagram
                          size={20}
                          className="mx-auto hover:text-primary"
                        />
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      {contact.subject}
                    </TableCell>
                    <TableCell className="text-center">
                      <Select
                        value={contact.status}
                        onValueChange={(value) =>
                          handleStatus(value, contact._id)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="seen">Seen</SelectItem>
                          <SelectItem value="unseen">Unseen</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-center">
                      {date.toLocaleDateString()}{" "}
                      {date.toLocaleTimeString().slice(0, 5)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant={"destructive"}
                        onClick={() => handleDelete(contact._id)}
                      >
                        <Trash size={14} />
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        className="text-blue-500"
                        onClick={() => setDialog(contact)}
                      >
                        View
                      </button>
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
                {contacts.length} of {totalContacts} Mods
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <Dialog open={!!dialog} onOpenChange={() => setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-primary">
              {dialog?.subject}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 p-4 rounded-lg shadow-md text-sm">
            <p className="mb-3">
              <strong className="text-base font-semibold">Name:</strong>{" "}
              <span className="text-sm font-medium">{dialog?.name}</span>
            </p>
            <p className="mb-3">
              <strong className="text-base font-semibold">Email:</strong>{" "}
              <span className="text-sm font-medium">{dialog?.email}</span>
            </p>
            <p className="mb-3">
              <strong className="text-base font-semibold">Phone:</strong>{" "}
              <span className="text-sm font-medium">
                {dialog?.phone || "N/A"}
              </span>
            </p>
            <p className="flex items-center gap-2 mb-3">
              <strong className="text-base font-semibold">Instagram:</strong>
              {dialog?.instagram ? (
                <Link
                  href={dialog.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center underline transition duration-300 hover:text-blue-600"
                  aria-label="Open Instagram profile"
                >
                  <Instagram size={18} className="mr-1" />
                </Link>
              ) : (
                <span className="text-sm font-medium">N/A</span>
              )}
            </p>
            <p className="mb-3">
              <strong className="text-base font-semibold">Status:</strong>{" "}
              <span className="text-sm font-medium">{dialog?.status}</span>
            </p>
            <p className="mb-3">
              <strong className="text-base font-semibold">Created At:</strong>{" "}
              <span className="text-sm font-medium">
                {dialog?.createdAt.slice(0, 10)}
              </span>
            </p>
            <div>
              <strong className="text-base font-semibold">Message:</strong>
              <Textarea
                value={dialog?.message}
                disabled={true}
                className="resize-none mt-1 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring focus:ring-gray-400 transition duration-300"
                rows={4}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

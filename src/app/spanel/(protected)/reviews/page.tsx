"use client";

import NotFound from "@/components/shared/not-found";
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
import useCarousal from "@/hooks/use-carousal";
import { placeHolderImage } from "@/lib/constants";
import { getReviewsFn } from "@/services/review";
import ShimmerTableBody from "@/shimmer/Spanel/table-shimmer";
import { ModType } from "@/types/mod-types";
import { ReviewType } from "@/types/review-types";
import { UserType } from "@/types/store-types";
import { ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdVisibility } from "react-icons/md";

export default function OTPList() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const { handleSetImages } = useCarousal();

  useEffect(() => {
    setLoading(true);
    getReviewsFn({
      page,
      limit: 10,
    })
      .then((data) => {
        setTotalPages(data?.data?.totalPages);
        setReviews(data?.data?.reviews);
        setTotalReviews(data?.data?.totalReviews);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <>
      <Title title="Reviews" />
      <div className="overflow-x-auto w-full mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="text-center text-lg">Profile</TableCell>
              <TableCell className="text-center text-lg">Name</TableCell>
              <TableCell className="text-center text-lg">Email At</TableCell>
              <TableCell className="text-center text-lg">Mod Name</TableCell>
              <TableCell className="text-center text-lg">Mod Image</TableCell>
              <TableCell className="text-center text-lg">Liked</TableCell>
              <TableCell className="text-center text-lg">Rating</TableCell>
              <TableCell className="text-center text-lg">Created At</TableCell>
              <TableCell className="text-center text-lg">View Mod</TableCell>
            </TableRow>
          </TableHeader>
          {loading && <ShimmerTableBody row={5} coloumn={9} />}
          {!loading && reviews.length === 0 && (
            <TableBody>
              <TableRow>
                <TableCell className="min-h-[500px]" colSpan={11}>
                  <NotFound className="w-1/3 mx-auto" />
                </TableCell>
              </TableRow>
            </TableBody>
          )}

          {!loading &&
            reviews.map((review) => {
              const date = new Date(review?.createdAt);
              const user = review?.user_id as UserType;
              const mod = review?.mod_id as ModType;

              return (
                <TableBody key={review?._id}>
                  <TableRow key={review?._id}>
                    <TableCell className="text-center">
                      <p className="w-16 h-16 overflow-hidden rounded-full mx-auto">
                        <Image
                          src={
                            user?.avatar?.url || placeHolderImage(user?.name)
                          }
                          alt={user?.name}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() =>
                            handleSetImages(
                              [
                                user?.avatar?.url ||
                                  placeHolderImage(user?.name),
                              ],
                              0,
                            )
                          }
                        />
                      </p>
                    </TableCell>
                    <TableCell className="text-center">{user?.name}</TableCell>
                    <TableCell className="text-center">{user?.email}</TableCell>
                    <TableCell className="text-center text-ellipsis whitespace-nowrap overflow-hidden max-w-[200px]">
                      {mod?.title}
                    </TableCell>
                    <TableCell className="text-center">
                      <Image
                        src={mod?.main_image?.url}
                        alt={mod.title}
                        width={200}
                        height={200}
                        className="cursor-pointer"
                        style={{
                          width: "80px",
                          height: "50px",
                          objectFit: "cover",
                          margin: "0 auto",
                        }}
                        onClick={() =>
                          handleSetImages(
                            [
                              mod?.main_image?.url,
                              ...mod?.images.map((img) => img?.url),
                            ],
                            0,
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      {review?.likes ? (
                        <ThumbsUp className="mx-auto text-primary" size={20} />
                      ) : (
                        "--"
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {review?.rating}
                    </TableCell>
                    <TableCell className="text-center">
                      {date.toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <Link href={`/mods/${mod?.slug}`}>
                        <MdVisibility size={20} className="mx-auto" />
                      </Link>
                    </TableCell>
                  </TableRow>
                </TableBody>
              );
            })}
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
                {reviews.length} of {totalReviews} Mods
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  );
}

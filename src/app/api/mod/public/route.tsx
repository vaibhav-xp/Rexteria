import connectToDatabase from "@/lib/connectDatabase";
import catchAsyncHandler from "@/lib/tryCatch";
import Mod from "@/models/mod.model";
import ReturnNextResponse from "@/types/response-types";
import { StatusCodes } from "http-status-codes";

export const GET = catchAsyncHandler(async (req) => {
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10", 10);
  const sortField = req.nextUrl.searchParams.get("sortField") || "createdAt";
  const sortOrder =
    req.nextUrl.searchParams.get("sortOrder") === "asc" ? 1 : -1;
  const search = req.nextUrl.searchParams.get("search") || "";
  const categoryId = req.nextUrl.searchParams.get("categoryId");

  await connectToDatabase();

  // Create the query object
  const query = {
    $or: [
      { title: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ],
    ...{ status: true },
    ...(categoryId && { categoryId }),
  };

  // Get the total count of mods for pagination
  const totalMods = await Mod.countDocuments(query);

  // Calculate total pages
  const totalPages = Math.ceil(totalMods / limit);

  // Define sorting logic based on sortField
  let sortCriteria = {};

  if (sortField === "viewsAndRating") {
    sortCriteria = { rating: sortOrder, views: sortOrder };
  } else {
    sortCriteria = { [sortField]: sortOrder };
  }

  // Fetch the mods with sorting and pagination
  const mods = await Mod.find(query)
    .sort(sortCriteria)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("categoryId", "title")
    .populate("main_image", "url")
    .populate("images", "url");

  // Return the response with mods and pagination info
  return ReturnNextResponse(StatusCodes.OK, `Fetched mods`, {
    mods,
    page,
    limit,
    totalPages,
    totalMods,
  });
});

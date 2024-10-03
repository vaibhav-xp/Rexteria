import { authRequired } from "@/lib/authRoute";
import connectToDatabase from "@/lib/connectDatabase";
import ErrorCreator from "@/lib/errorCreator";
import catchAsyncHandler from "@/lib/tryCatch";
import { ROLES } from "@/middleware";
import User from "@/models/user.model";
import ReturnNextResponse from "@/types/response-types";
import { StatusCodes } from "http-status-codes";

export const GET = catchAsyncHandler(async (req) => {
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10", 10);
  const sortField = req.nextUrl.searchParams.get("sortField") || "createdAt";
  const sortOrder =
    req.nextUrl.searchParams.get("sortOrder") === "asc" ? 1 : -1;
  const search = req.nextUrl.searchParams.get("search") || "";

  await connectToDatabase();

  // Create the query object
  const query = {
    $or: [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { country: { $regex: search, $options: "i" } },
    ],
    role: "USER",
  };

  // Get the total count of users for pagination
  const totalUsers = await User.countDocuments(query);
  const totalPages = Math.ceil(totalUsers / limit);

  // Fetch the users with sorting and pagination
  const users = await User.find(query)
    .sort({ [sortField]: sortOrder })
    .skip((page - 1) * limit)
    .limit(limit);

  // Return the response with users and pagination info
  return ReturnNextResponse(StatusCodes.OK, "Fetched users", {
    users,
    page,
    limit,
    totalPages,
    totalUsers,
  });
});

export const PATCH = catchAsyncHandler(async (req) => {
  const response = await authRequired(req, [ROLES.ADMIN]);
  if (response) {
    return response;
  }

  const formData = await req.formData();
  const _id = formData.get("user_id");

  const isExist = await User.findById(_id);
  if (!isExist) {
    throw new ErrorCreator(
      StatusCodes.FORBIDDEN,
      "User with this ID doesn't exist.",
    );
  }

  // Update the status
  isExist.active = !isExist.active;
  await isExist.save();

  return ReturnNextResponse(
    StatusCodes.OK,
    isExist.active ? "User is now unblocked." : "User is blocked.",
  );
});

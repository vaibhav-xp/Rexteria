import { authRequired } from "@/lib/authRoute";
import catchAsyncHandler from "@/lib/tryCatch";
import { ROLES } from "@/middleware";
import Mod from "@/models/mod.model";
import ReviewModel from "@/models/review.model";
import ReturnNextResponse from "@/types/response-types";
import { StatusCodes } from "http-status-codes";

export const GET = catchAsyncHandler(async (req) => {
  const response = await authRequired(req, [ROLES.ADMIN]);
  if (response) return response;

  const params = req.nextUrl.searchParams;
  const limit = parseInt(params.get("limit") || "10", 10);
  const page = parseInt(params.get("page") || "1", 10);
  const totalReviews = await ReviewModel.countDocuments();
  const totalPages = Math.ceil(totalReviews / limit);

  const reviews = await ReviewModel.find()
    .skip(limit * (page - 1))
    .limit(limit)
    .populate("user_id")
    .populate({
      path: "mod_id",
      model: Mod,
      populate: [
        { path: "main_image", model: "gallery" },
        { path: "images", model: "gallery" },
      ],
    });

  return ReturnNextResponse(StatusCodes.OK, "Reviews fetched successfully.", {
    reviews,
    limit,
    totalReviews,
    totalPages,
    page,
  });
});

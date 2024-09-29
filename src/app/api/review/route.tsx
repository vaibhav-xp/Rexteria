import { authRequired } from "@/lib/authRoute";
import connectToDatabase from "@/lib/connectDatabase";
import ErrorCreator from "@/lib/errorCreator";
import catchAsyncHandler from "@/lib/tryCatch";
import { ROLES } from "@/middleware";
import Mod from "@/models/mod.model";
import ReviewModel from "@/models/review.model";
import ReturnNextResponse from "@/types/response-types";
import { StatusCodes } from "http-status-codes";

export const POST = catchAsyncHandler(async (req) => {
  const mod_id = (await req.formData()).get("mod_id");

  if (!mod_id)
    throw new ErrorCreator(StatusCodes.BAD_REQUEST, "Mod id is required.");

  await connectToDatabase();
  const mod = await Mod.findById(mod_id);

  if (!mod)
    throw new ErrorCreator(
      StatusCodes.NOT_FOUND,
      "Mod not found with this id.",
    );

  mod.views += 1;
  await mod.save();

  return ReturnNextResponse(StatusCodes.OK, "Views updated successfully");
});

export const PATCH = catchAsyncHandler(async (req) => {
  const response = await authRequired(req, [ROLES.ADMIN, ROLES.USER]);
  if (response) return response;

  const formData = await req.formData();
  const user_id = req?.user?._id;
  const mod_id = formData.get("mod_id");
  const rating = formData.get("rating") as string;
  const like = formData.get("like");

  await connectToDatabase();

  const mod = await Mod.findById(mod_id);
  if (!mod) {
    throw new ErrorCreator(
      StatusCodes.NOT_FOUND,
      "Mod with this id not found.",
    );
  }

  mod.likes = mod.likes || 0;
  mod.rating = mod.rating || 0;

  const review = await ReviewModel.findOne({ user_id, mod_id });

  if (review) {
    if (review.likes && like) {
      review.likes = false;
      mod.likes -= 1;
    } else if (like && !review.likes) {
      review.likes = true;
      mod.likes += 1;
    }

    if (rating) {
      const newRating = parseInt(rating, 10);
      const totalRating = mod.rating * mod.reviewCount - review.rating;
      review.rating = newRating;
      mod.rating = (totalRating + newRating) / mod.reviewCount;
    }

    await review.save();
  } else {
    const newReview = new ReviewModel({
      user_id,
      mod_id,
      likes: like === "true",
    });

    if (like === "true") mod.likes += 1;
    if (rating) {
      newReview.rating = parseInt(rating, 10);
      mod.rating =
        (mod.rating * mod.reviewCount + newReview.rating) /
        (mod.reviewCount + 1);
      mod.reviewCount += 1;
    }

    await newReview.save();
  }

  await mod.save();
  return ReturnNextResponse(StatusCodes.OK, "Updated successfully.");
});

export const GET = catchAsyncHandler(async (req) => {
  const response = await authRequired(req, [ROLES.ADMIN, ROLES.USER]);
  if (response) return response;

  const user_id = req?.user?._id;
  const mod_id = req.nextUrl.searchParams.get("mod_id");

  await connectToDatabase();
  const data = await ReviewModel.findOne({ user_id, mod_id });

  return ReturnNextResponse(StatusCodes.OK, "Data fetched successfully.", data);
});

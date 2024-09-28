import { authRequired } from "@/lib/authRoute";
import connectToDatabase from "@/lib/connectDatabase";
import ErrorCreator from "@/lib/errorCreator";
import catchAsyncHandler from "@/lib/tryCatch";
import { ROLES } from "@/middleware";
import Mod from "@/models/mod.model";
import WishlistModel from "@/models/wishlist.model";
import ReturnNextResponse from "@/types/response-types";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

export const POST = catchAsyncHandler(async (req) => {
  const response = await authRequired(req, [ROLES.ADMIN, ROLES.USER]);
  if (response) return response;

  const user_id = req?.user?._id;
  const mod_id = (await req.formData()).get("mod_id");

  if (!mod_id) {
    throw new ErrorCreator(StatusCodes.BAD_REQUEST, "Mod ID is required.");
  }

  await connectToDatabase();

  const mod = await Mod.findById(mod_id);
  if (!mod) {
    throw new ErrorCreator(
      StatusCodes.NOT_FOUND,
      "Mod not found with this ID.",
    );
  }

  let wishlist = await WishlistModel.findOne({ user_id });

  if (wishlist) {
    const modExists = wishlist.mods.some(
      (item: mongoose.Schema.Types.ObjectId) =>
        item.toString() === mod_id.toString(),
    );

    if (modExists) {
      throw new ErrorCreator(
        StatusCodes.CONFLICT,
        "Mod is already in the wishlist.",
      );
    }

    wishlist.mods.push(mod_id);
    await wishlist.save();
  } else {
    const newWishlist = new WishlistModel({
      user_id: user_id,
      mods: [mod_id],
    });
    await newWishlist.save();
  }

  return ReturnNextResponse(
    StatusCodes.OK,
    "Mod added to wishlist successfully.",
  );
});

export const GET = catchAsyncHandler(async (req) => {
  const response = await authRequired(req, [ROLES.ADMIN, ROLES.USER]);
  if (response) return response;

  const user_id = req?.user?._id;

  await connectToDatabase();

  const wishlist = await WishlistModel.findOne({ user_id }).populate({
    path: "mods",
    model: Mod,
    populate: [
      { path: "main_image", model: "gallery" },
      { path: "images", model: "gallery" },
    ],
  });

  return ReturnNextResponse(
    StatusCodes.OK,
    "Wishlist fetched successfully.",
    wishlist,
  );
});

export const DELETE = catchAsyncHandler(async (req) => {
  const response = await authRequired(req, [ROLES.ADMIN, ROLES.USER]);
  if (response) return response;

  const user_id = req?.user?._id;
  const mod_id = (await req.formData()).get("mod_id");

  if (!mod_id) {
    throw new ErrorCreator(StatusCodes.BAD_REQUEST, "Mod ID is required.");
  }

  await connectToDatabase();

  const wishlist = await WishlistModel.findOne({ user_id });

  if (!wishlist) {
    throw new ErrorCreator(StatusCodes.NOT_FOUND, "Wishlist not found.");
  }

  const modIndex = wishlist.mods.indexOf(mod_id);

  if (modIndex === -1) {
    throw new ErrorCreator(StatusCodes.NOT_FOUND, "Mod not found in wishlist.");
  }

  wishlist.mods.splice(modIndex, 1);
  await wishlist.save();

  return ReturnNextResponse(
    StatusCodes.OK,
    "Mod removed from wishlist successfully.",
  );
});

import { authRequired } from "@/lib/authRoute";
import connectToDatabase from "@/lib/connectDatabase";
import ErrorCreator from "@/lib/errorCreator";
import catchAsyncHandler from "@/lib/tryCatch";
import { ROLES } from "@/middleware";
import ModCategory from "@/models/category.model";
import GalleryModel from "@/models/gallery";
import Mod from "@/models/mod.model";
import ReturnNextResponse from "@/types/response-types";
import console from "console";
import { StatusCodes } from "http-status-codes";
import { NextRequest } from "next/server";

export const POST = catchAsyncHandler(async (req: NextRequest) => {
  await authRequired(req, [ROLES.ADMIN]);

  const data = await req.formData();
  const title = data.get("title");
  const image = data.get("image");

  console.log(title, image);

  if (!title || !image) {
    throw new ErrorCreator(
      StatusCodes.BAD_REQUEST,
      "Title & image are required.",
    );
  }

  await connectToDatabase();

  const isExist = await ModCategory.findOne({ title });
  if (isExist) {
    throw new ErrorCreator(
      StatusCodes.BAD_REQUEST,
      "Category with this title already exists.",
    );
  }

  // Check if the image exists in the gallery
  const galleryExists = await GalleryModel.findOne({ _id: image });
  if (!galleryExists) {
    throw new ErrorCreator(
      StatusCodes.BAD_REQUEST,
      "Image does not exist in the gallery.",
    );
  }

  const newCategory = new ModCategory({ title, image });
  await newCategory.save();

  return ReturnNextResponse(
    StatusCodes.CREATED,
    `Category "${newCategory.title}" created successfully.`,
  );
});

export const PATCH = catchAsyncHandler(async (req: NextRequest) => {
  await authRequired(req, [ROLES.ADMIN]);

  const data = await req.formData();
  const _id = data.get("_id");
  const title = data.get("title");
  const image = data.get("image");

  if (!_id) {
    throw new ErrorCreator(
      StatusCodes.BAD_REQUEST,
      "Category _id is required.",
    );
  }

  if (!title) {
    throw new ErrorCreator(StatusCodes.BAD_REQUEST, "Title is required.");
  }

  await connectToDatabase();

  const isExist = await ModCategory.findById(_id);
  if (!isExist) {
    throw new ErrorCreator(
      StatusCodes.NOT_FOUND,
      "Category not found with the provided _id.",
    );
  }

  const existingTitle = await ModCategory.findOne({ title, _id: { $ne: _id } });
  if (existingTitle) {
    throw new ErrorCreator(
      StatusCodes.BAD_REQUEST,
      "A category with this title already exists.",
    );
  }

  // Check if the new image exists in the gallery
  if (image) {
    const galleryExists = await GalleryModel.findOne({ _id: image });
    if (!galleryExists) {
      throw new ErrorCreator(
        StatusCodes.BAD_REQUEST,
        "Image does not exist in the gallery.",
      );
    }
  }

  isExist.title = title;
  isExist.image = image;

  await isExist.save();

  return ReturnNextResponse(
    StatusCodes.OK,
    `Category "${isExist.title}" updated successfully.`,
  );
});

export const GET = catchAsyncHandler(async () => {
  await connectToDatabase();
  const categories = await ModCategory.find().populate("image");
  return ReturnNextResponse(
    StatusCodes.OK,
    "Categories fetched successfully.",
    categories,
  );
});

export const DELETE = catchAsyncHandler(async (req: NextRequest) => {
  await authRequired(req, [ROLES.ADMIN]);

  const data = await req.formData();
  const _id = data.get("_id") as string;

  if (!_id) {
    throw new ErrorCreator(
      StatusCodes.BAD_REQUEST,
      "Category _id is required.",
    );
  }

  await connectToDatabase();

  const isExist = await ModCategory.findById(_id);
  if (!isExist) {
    throw new ErrorCreator(StatusCodes.NOT_FOUND, "Category doesn't exist.");
  }

  const categoryName = isExist.title;

  const modsExist = await Mod.find({ categoryId: isExist._id });

  // Add a check to see if mods actually exist
  if (modsExist.length > 0) {
    throw new ErrorCreator(
      StatusCodes.FORBIDDEN,
      "Mods are already assigned to this category. Deletion is not possible.",
    );
  }

  await isExist.deleteOne();

  return ReturnNextResponse(
    StatusCodes.OK,
    `Category "${categoryName}" deleted successfully.`,
  );
});

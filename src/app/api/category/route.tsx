import { deleteImage, uploadImage } from "@/lib/cloudinary";
import connectToDatabase from "@/lib/connectDatabase";
import ErrorCreator from "@/lib/errorCreator";
import catchAsyncHandler from "@/lib/tryCatch";
import ModCategory from "@/models/category.model";
import { ImageType } from "@/types/image-types";
import ReturnNextResponse from "@/types/response-types";
import { StatusCodes } from "http-status-codes";

export const POST = catchAsyncHandler(async (req: Request) => {
  const data = await req.formData();
  const title = data.get("title") as string | null;
  const imageFile = data.get("image") as File | null;

  if (!title) {
    throw new ErrorCreator(StatusCodes.BAD_REQUEST, "Title is required.");
  }

  if (!imageFile) {
    throw new ErrorCreator(StatusCodes.BAD_REQUEST, "Image file is required.");
  }

  await connectToDatabase();
  const isExist = await ModCategory.findOne({ title });
  if (isExist) {
    throw new ErrorCreator(
      StatusCodes.BAD_REQUEST,
      "Category with this title already exists.",
    );
  }

  const image = await uploadImage(imageFile);
  const newCategory = new ModCategory({ title, image });

  await newCategory.save();

  return ReturnNextResponse(
    StatusCodes.CREATED,
    `Category "${newCategory.title}" created successfully.`,
  );
});

export const PATCH = catchAsyncHandler(async (req: Request) => {
  const data = await req.formData();
  const _id = data.get("_id") as string;
  const title = data.get("title") as string;
  const imageFile = data.get("image") as File;

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

  let image: ImageType | undefined;
  if (imageFile) {
    image = await uploadImage(imageFile);
  }

  isExist.title = title;
  if (image) {
    await deleteImage(isExist.image.public_id);
    isExist.image = image;
  }

  await isExist.save();

  return ReturnNextResponse(
    StatusCodes.OK,
    `Category "${isExist.title}" updated successfully.`,
  );
});

export const GET = catchAsyncHandler(async () => {
  await connectToDatabase();
  const categories = await ModCategory.find();
  return ReturnNextResponse(
    StatusCodes.OK,
    "Categories fetched successfully.",
    categories,
  );
});

export const DELETE = catchAsyncHandler(async (req: Request) => {
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
  if (isExist.image?.public_id) {
    await deleteImage(isExist.image.public_id);
  }

  await isExist.deleteOne();

  return ReturnNextResponse(
    StatusCodes.OK,
    `Category "${categoryName}" deleted successfully.`,
  );
});

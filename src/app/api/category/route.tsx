import { uploadImage } from "@/lib/cloudinary";
import connectToDatabase from "@/lib/connectDatabase";
import ErrorCreator from "@/lib/errorCreator";
import catchAsyncHandler from "@/lib/tryCatch";
import ModCategory from "@/models/category.model";
import ReturnNextResponse from "@/types/response-types";
import { StatusCodes } from "http-status-codes";

// Handler for POST requests to create a new category
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

  return ReturnNextResponse(StatusCodes.OK, "Category Created Sucessfully.");
});

// Handler for GET requests to fetch all categories
export const GET = catchAsyncHandler(async () => {
  await connectToDatabase();

  const categories = await ModCategory.find();
  return ReturnNextResponse(
    StatusCodes.OK,
    "Categories fetched successfully.",
    categories,
  );
});

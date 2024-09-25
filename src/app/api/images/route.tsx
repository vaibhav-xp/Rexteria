import { authRequired } from "@/lib/authRoute";
import { deleteImage, uploadMultipleImages } from "@/lib/cloudinary";
import connectToDatabase from "@/lib/connectDatabase";
import catchAsyncHandler from "@/lib/tryCatch";
import { ROLES } from "@/middleware";
import GalleryModel from "@/models/gallery";
import ReturnNextResponse, {
  NextRequestWithUser,
} from "@/types/response-types";
import { StatusCodes } from "http-status-codes";

// POST: Upload multiple images
export const POST = catchAsyncHandler(async (req: NextRequestWithUser) => {
  const response = authRequired(req, [ROLES.ADMIN]);
  if (response) {
    return response;
  }

  const formData = await req.formData();
  const imageFiles: File[] = Array.from(formData.values()) as File[];

  const uploadedImages = await uploadMultipleImages(imageFiles);

  await connectToDatabase();
  await GalleryModel.insertMany(uploadedImages);

  return ReturnNextResponse(
    StatusCodes.OK,
    "Images are uploaded successfully.",
  );
});

// GET: Get all images
export const GET = catchAsyncHandler(async () => {
  await connectToDatabase();
  const images = await GalleryModel.find().sort({ createdAt: -1 });
  return ReturnNextResponse(
    StatusCodes.OK,
    "Images retrieved successfully.",
    images,
  );
});

// DELETE: Delete images based on public_id
export const DELETE = catchAsyncHandler(async (req: NextRequestWithUser) => {
  const response = authRequired(req, [ROLES.ADMIN]);
  if (response) {
    return response;
  }

  const formData = await req.formData();
  const imageIds: string[] = Array.from(formData.values()).map(
    (value) => value as string,
  );

  await connectToDatabase();
  await Promise.all(
    imageIds.map(async (public_id) => {
      try {
        await deleteImage(public_id);
        await GalleryModel.deleteOne({ public_id });
      } catch (error) {
        console.error(`Error deleting image with ID ${public_id}:`, error);
      }
    }),
  );

  return ReturnNextResponse(StatusCodes.OK, "Images deleted successfully.");
});

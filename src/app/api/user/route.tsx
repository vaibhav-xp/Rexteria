import { authRequired } from "@/lib/authRoute";
import { deleteImage, uploadImage } from "@/lib/cloudinary";
import connectToDatabase from "@/lib/connectDatabase";
import ErrorCreator from "@/lib/errorCreator";
import catchAsyncHandler from "@/lib/tryCatch";
import { ROLES } from "@/middleware";
import User from "@/models/user.model";
import { ImageType } from "@/types/image-types";
import ReturnNextResponse from "@/types/response-types";
import { StatusCodes } from "http-status-codes";

export const PATCH = catchAsyncHandler(async (req) => {
  const response = await authRequired(req, [ROLES.USER, ROLES.ADMIN]);
  if (response) return response;

  if (!req.user)
    throw new ErrorCreator(StatusCodes.UNAUTHORIZED, "User is unauthorized");

  const _id = req.user._id;
  const formData = await req.formData();
  const name = formData.get("name");
  const avatar = formData.get("avatar") as File;
  const country = formData.get("country");
  const phone = formData.get("phone");
  const youtube = formData.get("youtube");
  const instagram = formData.get("instagram");
  const x = formData.get("x");

  console.log("hello");

  // Validate required fields
  if (!name || !country || !phone || !instagram) {
    throw new ErrorCreator(
      StatusCodes.BAD_REQUEST,
      "All fields are required except YouTube and X",
    );
  }

  await connectToDatabase();
  const user = await User.findById(_id);
  if (!user) {
    throw new ErrorCreator(StatusCodes.NOT_FOUND, "User not found");
  }

  let image: ImageType | undefined;

  if (avatar) {
    if (user?.avatar?.public_id) await deleteImage(user?.avatar?.public_id);
    image = await uploadImage(avatar);
  }

  // Update user data
  user.name = name;
  user.avatar = image;
  user.country = country;
  user.phone = phone;
  user.youtube = youtube || user.youtube;
  user.instagram = instagram;
  user.x = x || user.x;

  await user.save();

  return ReturnNextResponse(StatusCodes.OK, "Profile updated successfully.");
});

// GET request for retrieving user profile
export const GET = catchAsyncHandler(async (req) => {
  const authToken = req.cookies.get("token");
  if (!authToken)
    return ReturnNextResponse(StatusCodes.OK, "User is not logged In");

  const response = await authRequired(req, [ROLES.USER, ROLES.ADMIN]);
  if (response) return response;
  if (!req.user)
    throw new ErrorCreator(StatusCodes.UNAUTHORIZED, "User is unauthorized");

  const _id = req.user._id;

  await connectToDatabase();
  const user = await User.findById(_id);
  if (!user) {
    throw new ErrorCreator(StatusCodes.NOT_FOUND, "User not found");
  }

  return ReturnNextResponse(
    StatusCodes.OK,
    "Profile retrieved successfully",
    user,
  );
});

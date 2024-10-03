import { authRequired } from "@/lib/authRoute";
import catchAsyncHandler from "@/lib/tryCatch";
import { ROLES } from "@/middleware";
import ModCategory from "@/models/category.model";
import EnquiryModel from "@/models/enquiry.model";
import GalleryModel from "@/models/gallery";
import Mod from "@/models/mod.model";
import OTP from "@/models/otp.model";
import ReviewModel from "@/models/review.model";
import User from "@/models/user.model";
import ReturnNextResponse from "@/types/response-types";
import { StatusCodes } from "http-status-codes";

export const GET = catchAsyncHandler(async (req) => {
  const response = await authRequired(req, [ROLES.ADMIN]);
  if (response) return response;

  const [
    totalCategories,
    activeMods,
    totalMods,
    top5ModsByRating,
    top5ModsByViews,
    totalGalleryImage,
    activeUsers,
    recentReviews,
    otps,
    recentEnquiry,
  ] = await Promise.all([
    ModCategory.countDocuments(),
    Mod.countDocuments({ status: true }),
    Mod.countDocuments(),
    Mod.find()
      .sort({ rating: -1 })
      .limit(5)
      .select("title rating main_image slug")
      .populate("main_image"),
    Mod.find()
      .sort({ views: -1 })
      .limit(5)
      .select("title views main_image slug")
      .populate("main_image"),
    GalleryModel.countDocuments(),
    User.countDocuments({ active: true, role: ROLES.USER }),
    ReviewModel.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "mod_id",
        populate: [{ path: "main_image", model: "gallery" }],
      })
      .populate("user_id")
      .limit(5),
    OTP.countDocuments(),
    EnquiryModel.find({ status: { $ne: "completed" } })
      .sort({ createdAt: -1 })
      .populate("user_id")
      .limit(5),
  ]);

  return ReturnNextResponse(StatusCodes.OK, "Analytics fetched successfully.", {
    totalCategories,
    activeMods,
    totalMods,
    top5ModsByRating,
    top5ModsByViews,
    totalGalleryImage,
    activeUsers,
    recentReviews,
    otps,
    recentEnquiry,
  });
});

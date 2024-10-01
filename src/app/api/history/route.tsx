import { authRequired } from "@/lib/authRoute";
import connectToDatabase from "@/lib/connectDatabase";
import catchAsyncHandler from "@/lib/tryCatch";
import { ROLES } from "@/middleware";
import EnquiryModel from "@/models/enquiry.model";
import { EnquiryStatus, EnquiryType } from "@/types/enquiry-types";
import { ModType } from "@/types/mod-types";
import ReturnNextResponse from "@/types/response-types";
import { UserType } from "@/types/store-types";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

const filterEnquiries = (enquiries: EnquiryType[], search: string) => {
  return enquiries.filter((enquiry: EnquiryType) => {
    const user = enquiry.user_id as UserType;
    return (
      (search &&
        (user.name.includes(search) ||
          user.email.includes(search) ||
          String(user.phone).includes(search))) ||
      (enquiry.message && enquiry.message.includes(search)) ||
      enquiry.mods.some((item) => {
        const mod = item?.mod_id as ModType;
        return mod?.title.includes(search);
      })
    );
  });
};

export const GET = catchAsyncHandler(async (req) => {
  const response = await authRequired(req, [ROLES.ADMIN]);
  if (response) return response;

  const params = req.nextUrl.searchParams;
  const search = (params.get("search") as string) || "";
  const searchById = params.get("searchById") as string;
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10", 10);

  const enquiryFilter = {
    ...(searchById && { _id: new mongoose.Types.ObjectId(searchById) }),
    status: { $eq: "completed" },
  };

  await connectToDatabase();

  const totalEnquiries = await EnquiryModel.countDocuments(enquiryFilter);

  const totalPages = Math.ceil(totalEnquiries / limit);

  const enquiries = await EnquiryModel.find(enquiryFilter)
    .populate("user_id")
    .populate({
      path: "mods.mod_id",
      populate: [{ path: "main_image", model: "gallery" }],
    })
    .sort({ createdAt: -1 })
    .skip(limit * (page - 1))
    .limit(limit)
    .lean();

  const filteredEnquiries = filterEnquiries(enquiries as EnquiryType[], search);

  return ReturnNextResponse(StatusCodes.OK, "Enquiries fetched successfully.", {
    enquiries: filteredEnquiries,
    page,
    totalPages,
    limit,
    totalEnquiries,
  });
});

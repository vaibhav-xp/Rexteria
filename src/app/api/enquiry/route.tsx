import { authRequired } from "@/lib/authRoute";
import connectToDatabase from "@/lib/connectDatabase";
import ErrorCreator from "@/lib/errorCreator";
import catchAsyncHandler from "@/lib/tryCatch";
import {
  generateWhatsAppMessage,
  whatsappNumber,
} from "@/lib/whastsapp-template";
import { ROLES } from "@/middleware";
import CartModel from "@/models/cart.model";
import EnquiryModel from "@/models/enquiry.model";
import User from "@/models/user.model";
import ReturnNextResponse from "@/types/response-types";
import { StatusCodes } from "http-status-codes";

export const POST = catchAsyncHandler(async (req) => {
  const response = await authRequired(req, [ROLES.USER, ROLES.ADMIN]);
  if (response) return response;

  const user_id = req?.user?._id;
  const data = await req.json();
  const message = data?.message?.trim();

  await connectToDatabase();

  const user = await User.findById(user_id);

  const isCart = await CartModel.findOne({ user_id }).populate({
    path: "mods.mod_id",
    model: "mod",
    populate: [
      {
        path: "main_image",
        model: "gallery",
      },
      {
        path: "images",
        model: "gallery",
      },
    ],
  });

  if (!isCart) {
    throw new ErrorCreator(
      StatusCodes.NOT_FOUND,
      "Cart not found with this id."
    );
  }

  const template = generateWhatsAppMessage(user._doc, isCart, req, message);
  const whatsappLink = `https://wa.me/91${whatsappNumber}?text=${template}`;
  await isCart.deleteOne();
  return ReturnNextResponse(
    StatusCodes.OK,
    "Enquiry Sent Successfully. Checkout in your orders.",
    whatsappLink
  );
});

export const GET = catchAsyncHandler(async (req) => {
  const response = await authRequired(req, [ROLES.USER, ROLES.ADMIN]);
  if (response) return response;

  const user_id = req?.user?._id;
  await connectToDatabase();

  const enquiries = await EnquiryModel.find({ user_id })
    .sort({ createdAt: -1 })
    .populate({
      path: "mods.mod_id",
      populate: [{ path: "main_image", model: "gallery" }],
    });

  return ReturnNextResponse(
    StatusCodes.OK,
    "Order history fetched successfully.",
    enquiries
  );
});

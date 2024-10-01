import { authRequired } from "@/lib/authRoute";
import connectToDatabase from "@/lib/connectDatabase";
import ErrorCreator from "@/lib/errorCreator";
import catchAsyncHandler from "@/lib/tryCatch";
import { ROLES } from "@/middleware";
import CartModel from "@/models/cart.model";
import EnquiryModel from "@/models/enquiry.model";
import { CartModType } from "@/types/cart-types";
import ReturnNextResponse from "@/types/response-types";
import { StatusCodes } from "http-status-codes";

export const POST = catchAsyncHandler(async (req) => {
  const response = await authRequired(req, [ROLES.USER, ROLES.ADMIN]);
  if (response) return response;

  const user_id = req?.user?._id;
  const data = await req.json();
  const message = data?.message;

  await connectToDatabase();

  const isCart = await CartModel.findOne({ user_id });

  if (!isCart) {
    throw new ErrorCreator(
      StatusCodes.NOT_FOUND,
      "Cart not found with this id.",
    );
  }

  const mods = isCart?.mods.map((cartItem: CartModType) => ({
    mod_id: cartItem?.mod_id.toString() as string,
    quantity: cartItem?.quantity,
    price: cartItem?.price,
    totalAmount: cartItem?.price * cartItem?.quantity,
  }));

  const newEnquiry = new EnquiryModel({
    user_id,
    mods,
    pitchPrice: isCart?.totalAmount,
    ...(message && { message }),
  });
  await newEnquiry.save();
  await isCart.deleteOne();
  return ReturnNextResponse(
    StatusCodes.OK,
    "Enquiry Sent Successfully. Checkout in your orders.",
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
    enquiries,
  );
});

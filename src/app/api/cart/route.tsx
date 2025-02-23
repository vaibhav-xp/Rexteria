import { authRequired } from "@/lib/authRoute";
import connectToDatabase from "@/lib/connectDatabase";
import ErrorCreator from "@/lib/errorCreator";
import catchAsyncHandler from "@/lib/tryCatch";
import { ROLES } from "@/middleware";
import CartModel from "@/models/cart.model";
import Mod from "@/models/mod.model";
import { CartModType } from "@/types/cart-types";
import ReturnNextResponse from "@/types/response-types";
import { StatusCodes } from "http-status-codes";

export const POST = catchAsyncHandler(async (req) => {
  const response = await authRequired(req, [ROLES.ADMIN, ROLES.USER]);
  if (response) {
    return response;
  }

  const formData = await req.formData();
  const mod_id = formData.get("mod_id");
  const user_id = req?.user?._id;

  if (!mod_id) {
    throw new ErrorCreator(StatusCodes.BAD_REQUEST, "Mod_id is required.");
  }

  await connectToDatabase();

  const mod = await Mod.findById(mod_id);
  if (!mod) {
    throw new ErrorCreator(
      StatusCodes.NOT_FOUND,
      "Mod not found with this id."
    );
  }

  const isCart = await CartModel.findOne({ user_id });

  if (isCart) {
    const modPresent = isCart.mods.find(
      (item: CartModType) => item.mod_id.toString() === mod_id
    );

    if (modPresent) {
      throw new ErrorCreator(
        StatusCodes.CONFLICT,
        "Mod already exists in cart."
      );
    }

    isCart.mods.push({
      mod_id: mod_id,
      quantity: 1,
      price: mod.discount_price,
    });

    isCart.totalAmount += mod.discount_price;
    await isCart.save();
  } else {
    const newCart = new CartModel({
      user_id: user_id,
      mods: [
        {
          mod_id: mod_id,
          quantity: 1,
          price: mod.discount_price,
        },
      ],
      totalAmount: mod.discount_price,
    });
    await newCart.save();
  }

  return ReturnNextResponse(
    StatusCodes.OK,
    "Mod added to the cart successfully."
  );
});

export const GET = catchAsyncHandler(async (req) => {
  const response = await authRequired(req, [ROLES.ADMIN, ROLES.USER]);
  if (response) {
    return response;
  }

  const user_id = req?.user?._id;

  await connectToDatabase();
  const cart = await CartModel.findOne({ user_id })
    .populate({
      path: "mods.mod_id",
      populate: [
        { path: "main_image", model: "gallery" },
        { path: "images", model: "gallery" },
      ],
    })
    .lean();

  return ReturnNextResponse(
    StatusCodes.OK,
    "Cart data fetched successfully.",
    cart
  );
});

export const PATCH = catchAsyncHandler(async (req) => {
  const response = await authRequired(req, [ROLES.USER, ROLES.ADMIN]);
  if (response) return response;

  const formData = await req.formData();
  const mod_id = formData.get("mod_id");
  const type = formData.get("type");
  const user_id = req?.user?._id;

  const modProduct = await Mod.findById(mod_id);
  if (!modProduct) {
    throw new ErrorCreator(
      StatusCodes.NOT_FOUND,
      "Mod not found with this id."
    );
  }

  if (!mod_id) {
    throw new ErrorCreator(StatusCodes.BAD_REQUEST, "Mod id is required.");
  }

  await connectToDatabase();
  const cart = await CartModel.findOne({ user_id });

  if (!cart) {
    throw new ErrorCreator(StatusCodes.NOT_FOUND, "User's cart is empty.");
  }

  cart.mods = cart.mods.map((mod: CartModType) => {
    if (mod_id?.toString() === mod.mod_id.toString()) {
      mod.quantity =
        type === "inc" ? mod.quantity + 1 : Math.max(mod.quantity - 1, 1);
      mod.price = modProduct.discount_price * mod.quantity;
    }
    return mod;
  });

  cart.totalAmount = cart.mods.reduce(
    (total: number, mod: CartModType) => total + mod.price,
    0
  );
  await cart.save();

  return ReturnNextResponse(StatusCodes.OK, "Cart updated successfully.");
});

export const DELETE = catchAsyncHandler(async (req) => {
  const response = await authRequired(req, [ROLES.USER, ROLES.ADMIN]);
  if (response) return response;

  const formData = await req.formData();
  const mod_id = formData.get("mod_id");
  const user_id = req?.user?._id;

  if (!mod_id) {
    throw new ErrorCreator(StatusCodes.BAD_REQUEST, "Mod_id is required.");
  }

  await connectToDatabase();
  const cart = await CartModel.findOne({ user_id });

  if (!cart) {
    throw new ErrorCreator(StatusCodes.NOT_FOUND, "User's cart is empty.");
  }

  const modIndex = cart.mods.findIndex(
    (mod: CartModType) => mod.mod_id.toString() === mod_id
  );

  if (modIndex === -1) {
    throw new ErrorCreator(StatusCodes.NOT_FOUND, "Mod not found in the cart.");
  }

  // Remove the mod from the cart
  const modToRemove = cart.mods[modIndex];
  cart.mods.splice(modIndex, 1);
  cart.totalAmount -= modToRemove.price;

  // Ensure total amount does not go below zero
  cart.totalAmount = Math.max(cart.totalAmount, 0);

  await cart.save();

  return ReturnNextResponse(
    StatusCodes.OK,
    "Mod removed from the cart successfully."
  );
});

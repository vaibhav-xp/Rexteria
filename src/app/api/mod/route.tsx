import { authRequired } from "@/lib/authRoute";
import connectToDatabase from "@/lib/connectDatabase";
import ErrorCreator from "@/lib/errorCreator";
import createSlug from "@/lib/slugCreator";
import catchAsyncHandler from "@/lib/tryCatch";
import { ROLES } from "@/middleware";
import Mod from "@/models/mod.model";
import { ImageTypeWithID } from "@/types/image-types";
import ReturnNextResponse from "@/types/response-types";
import { StatusCodes } from "http-status-codes";

export const POST = catchAsyncHandler(async (req) => {
  const response = await authRequired(req, [ROLES.ADMIN]);
  if (response) return response;

  // Parse the incoming request body
  const data = await req.json();

  // Convert images to just the _id fields
  data.images = data.images.map((img: ImageTypeWithID) => img._id);

  // Validation: Check if all required fields are provided
  if (
    !data.categoryId ||
    !data.discount ||
    !data.price ||
    !data.title ||
    !data.images[0] ||
    !data.specifications
  ) {
    throw new ErrorCreator(
      StatusCodes.BAD_REQUEST,
      "All fields are required, except for the content field.",
    );
  }

  // Create a slug from the title
  data.slug = createSlug(data.title);

  // Connect to MongoDB
  await connectToDatabase();

  // Check if a mod with the same slug already exists
  const isModExist = await Mod.findOne({ slug: data.slug });
  if (isModExist) {
    throw new ErrorCreator(
      StatusCodes.BAD_REQUEST,
      "Mod already exists with this title.",
    );
  }

  // Create a new Mod instance
  const newMod = new Mod({
    title: data.title,
    slug: data.slug,
    specifications: data.specifications,
    content: data.content,
    main_image: data.images[0],
    images: data.images.slice(1),
    price: data.price.toFixed(0),
    discount: data.discount.toFixed(0),
    discount_price: (data.price * (1 - data.discount / 100)).toFixed(0),
    categoryId: data.categoryId,
    rating: 0,
    views: 0,
    likes: 0,
    status: data.status,
  });

  // Save the new mod document to the database
  await newMod.save();

  // Return a success response
  return ReturnNextResponse(StatusCodes.OK, "Mod created successfully", newMod);
});

export const PATCH = catchAsyncHandler(async (req) => {
  const response = await authRequired(req, [ROLES.ADMIN]);
  if (response) return response;

  // Parse the incoming request body
  const data = await req.json();

  // Convert images to just the _id fields
  data.images = data.images.map((img: ImageTypeWithID) => img._id);

  // Validation: Check if all required fields are provided
  if (
    !data.categoryId ||
    !data.discount ||
    !data.price ||
    !data.title ||
    !data.images[0] ||
    !data.specifications
  ) {
    throw new ErrorCreator(
      StatusCodes.BAD_REQUEST,
      "All fields are required, except for the content field.",
    );
  }

  // Create a slug from the title
  data.slug = createSlug(data.title);

  // Connect to MongoDB
  await connectToDatabase();

  // Check if a mod with the same slug already exists
  const isModExist = await Mod.findById(data._id);
  if (!isModExist) {
    throw new ErrorCreator(
      StatusCodes.BAD_REQUEST,
      "Mod is not found with this id.",
    );
  }

  // Create a new Mod instance
  isModExist.title = data.title;
  isModExist.slug = data.slug;
  isModExist.specifications = data.specifications;
  isModExist.content = data.content;
  isModExist.main_image = data.images[0];
  isModExist.images = data.images.slice(1);
  isModExist.price = data.price.toFixed(0);
  isModExist.discount = data.discount.toFixed(0);
  isModExist.discount_price = (data.price * (1 - data.discount / 100)).toFixed(
    2,
  );
  isModExist.categoryId = data.categoryId;
  isModExist.status = data.status;

  // Save the new mod document to the database
  await isModExist.save();

  // Return a success response
  return ReturnNextResponse(StatusCodes.OK, "Mod updated successfully");
});

export const GET = catchAsyncHandler(async (req) => {
  const response = await authRequired(req, [ROLES.ADMIN]);
  if (response) return response;
  // Extract query parameters for pagination, sorting, and filtering
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10", 10);
  const sortField = req.nextUrl.searchParams.get("sortField") || "createdAt";
  const sortOrder =
    req.nextUrl.searchParams.get("sortOrder") === "asc" ? 1 : -1;
  const search = req.nextUrl.searchParams.get("search") || "";
  const categoryId = req.nextUrl.searchParams.get("categoryId");

  await connectToDatabase();

  // Create the query object
  const query = {
    $or: [
      { title: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ],
    ...(categoryId && { categoryId }),
  };

  // Get the total count of mods for pagination
  const totalMods = await Mod.countDocuments(query);

  // Calculate total pages
  const totalPages = Math.ceil(totalMods / limit);

  // Fetch the mods with sorting and pagination
  const mods = await Mod.find(query)
    .sort({ [sortField]: sortOrder })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("categoryId", "title")
    .populate("main_image", "url")
    .populate("images", "url");

  // Return the response with mods and pagination info
  return ReturnNextResponse(StatusCodes.OK, `Fetched mods`, {
    mods,
    page,
    limit,
    totalPages,
    totalMods,
  });
});

export const DELETE = catchAsyncHandler(async (req) => {
  const response = await authRequired(req, [ROLES.ADMIN]);
  if (response) return response;

  await connectToDatabase();

  // Get the mod ID from the request URL parameters
  const modId = req.nextUrl.searchParams.get("mod_id");

  if (!modId) {
    throw new ErrorCreator(StatusCodes.BAD_REQUEST, "Mod ID is required.");
  }

  // Attempt to find and delete the mod
  const deletedMod = await Mod.findByIdAndDelete(modId);
  if (!deletedMod) {
    throw new ErrorCreator(StatusCodes.NOT_FOUND, "Mod not found.");
  }

  // Return a success response
  return ReturnNextResponse(StatusCodes.OK, `Mod deleted successfully.`);
});

import connectToDatabase from "@/lib/connectDatabase";
import ErrorCreator from "@/lib/errorCreator";
import catchAsyncHandler, { Params } from "@/lib/tryCatch";
import Mod from "@/models/mod.model";
import ReturnNextResponse from "@/types/response-types";
import { StatusCodes } from "http-status-codes";

// For the new app directory routing
export const GET = catchAsyncHandler(async (_, query) => {
  const {
    params: { _id },
  } = query as Params;
  console.log(_id);

  // Fetch the mod by ID
  await connectToDatabase();
  const mod = await Mod.findOne({ slug: _id })
    .populate("images")
    .populate("main_image")
    .populate("categoryId");
  if (!mod) {
    throw new ErrorCreator(
      StatusCodes.NOT_FOUND,
      "Mod with this ID doesn't exist."
    );
  }

  return ReturnNextResponse(StatusCodes.OK, "Mod fetched successfully.", mod);
});

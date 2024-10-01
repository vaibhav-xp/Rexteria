import { authRequired } from "@/lib/authRoute";
import catchAsyncHandler from "@/lib/tryCatch";
import { ROLES } from "@/middleware";
import ReturnNextResponse from "@/types/response-types";
import { StatusCodes } from "http-status-codes";

export const GET = catchAsyncHandler(async (req) => {
  const response = await authRequired(req, [ROLES.ADMIN]);

  return ReturnNextResponse(StatusCodes.OK, "Analytics fetched successfully.");
});

import catchAsyncHandler from "@/lib/tryCatch";
import ReturnNextResponse from "@/types/response-types";
import { StatusCodes } from "http-status-codes";

export const POST = catchAsyncHandler(async (req) => {
  const token = req.cookies.get("token");

  if (!token) {
    return ReturnNextResponse(
      StatusCodes.UNAUTHORIZED,
      "User is not logged in.",
    );
  }

  const res = ReturnNextResponse(
    StatusCodes.OK,
    "User logged out successfully.",
  );

  res.cookies.delete("token");
  return res;
});

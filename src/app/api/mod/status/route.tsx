import { authRequired } from "@/lib/authRoute";
import ErrorCreator from "@/lib/errorCreator";
import catchAsyncHandler from "@/lib/tryCatch";
import { ROLES } from "@/middleware";
import Mod from "@/models/mod.model";
import ReturnNextResponse, {
  NextRequestWithUser,
} from "@/types/response-types";
import { StatusCodes } from "http-status-codes";

export const PATCH = catchAsyncHandler(async (req: NextRequestWithUser) => {
  const response = await authRequired(req, [ROLES.ADMIN]);
  if (response) {
    return response;
  }

  const formData = await req.formData();
  const _id = formData.get("mod_id");

  const isExist = await Mod.findById(_id);
  if (!isExist) {
    throw new ErrorCreator(
      StatusCodes.FORBIDDEN,
      "Mod with this ID doesn't exist.",
    );
  }

  // Update the status
  isExist.status = !isExist.status;
  await isExist.save();

  return ReturnNextResponse(
    StatusCodes.OK,
    isExist.status
      ? "Mod has been successfully published."
      : "Mod is currently disabled.",
  );
});

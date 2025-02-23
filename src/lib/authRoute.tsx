import ReturnNextResponse, {
  NextRequestWithUser,
} from "@/types/response-types";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import ErrorCreator from "./errorCreator";
import { NextResponse } from "next/server";
import { UserType } from "@/types/store-types";
import connectToDatabase from "./connectDatabase";
import User from "@/models/user.model";

export async function authRequired(
  req: NextRequestWithUser,
  assignedRoles?: string[]
): Promise<NextResponse | null> {
  const authToken = req.cookies.get("token");

  if (!authToken) {
    throw new ErrorCreator(StatusCodes.FORBIDDEN, "User is not authorized.");
  }

  const token = authToken.value;

  try {
    const verified = jwt.verify(
      token,
      process.env.SECRET_ACCESS_TOKEN as string
    ) as UserType;

    if (!verified) {
      throw new ErrorCreator(
        StatusCodes.UNAUTHORIZED,
        "User is not authorized."
      );
    }

    await connectToDatabase();
    const userIsActive = await User.findById(verified?._id);
    if (!userIsActive) {
      throw new ErrorCreator(StatusCodes.NOT_FOUND, "User not found.");
    }

    if (userIsActive && !userIsActive?.active) {
      throw new ErrorCreator(
        StatusCodes.FORBIDDEN,
        "User is blocked. Contact to the administrator."
      );
    }

    if (assignedRoles) {
      allowedRoles(verified, assignedRoles);
    }

    req.user = verified;
    return null;
  } catch (error) {
    console.error("JWT Verification Error:", error);
    const response = ReturnNextResponse(
      StatusCodes.UNAUTHORIZED,
      "User is not authorized."
    );
    response.cookies.delete("token");
    return response;
  }
}

export function allowedRoles(
  user: JwtPayload,
  assignedRoles: string[]
): boolean {
  const userRole = user.role as string | undefined;

  if (!userRole) {
    throw new ErrorCreator(StatusCodes.UNAUTHORIZED, "User role not found.");
  }

  const assigned = assignedRoles.includes(userRole);

  if (!assigned) {
    throw new ErrorCreator(
      StatusCodes.UNAUTHORIZED,
      "Only authorized roles have access."
    );
  }

  return assigned;
}

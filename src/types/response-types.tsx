import { NextRequest, NextResponse } from "next/server";
import { UserType } from "./store-types";

interface ResponseType {
  statusCode: number;
  message: string;
  data?: unknown;
}

export class NextRequestWithUser extends NextRequest {
  user?: UserType;
}

const ReturnNextResponse = (
  statusCode: number,
  message: string,
  data?: unknown
): NextResponse => {
  const response: ResponseType = {
    statusCode,
    message,
  };

  if (data) {
    response.data = data;
  }

  return NextResponse.json(response, { status: statusCode });
};

export default ReturnNextResponse;

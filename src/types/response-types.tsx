import { JwtPayload } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";

interface ResponseType {
  statusCode: number;
  message: string;
  data?: unknown;
}

export class NextRequestWithUser extends NextRequest {
  user?: JwtPayload;
}

const ReturnNextResponse = (
  statusCode: number,
  message: string,
  data?: unknown,
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

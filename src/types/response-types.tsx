import { NextResponse } from "next/server";

interface ResponseType {
  statusCode: number;
  message: string;
  data?: unknown;
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

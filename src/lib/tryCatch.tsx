import { NextRequestWithUser } from "@/types/response-types";
import { NextResponse } from "next/server";
import ErrorCreator from "./errorCreator";

/**
 * Wraps an asynchronous function to catch any errors and pass them to the next middleware.
 *
 * @param {Function} fn - The asynchronous function to be wrapped. This function should take the req object.
 * @returns {Function} - A new function that handles the execution of the async function and catches any errors.
 */

export interface Params {
  params: {
    _id: string;
  };
}

const catchAsyncHandler =
  (fn: (req: NextRequestWithUser, query?: Params) => Promise<NextResponse>) =>
  async (req: NextRequestWithUser, query?: Params) => {
    try {
      const response = await fn(req, query);
      return response;
    } catch (error) {
      console.log(error);
      if (error instanceof ErrorCreator) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Internal Server Error";

        return NextResponse.json(
          {
            statusCode: statusCode,
            message: message,
          },
          { status: error.statusCode },
        );
      }

      return NextResponse.json(
        {
          statusCode: 500,
          message: "An unexpected error occurred.",
        },
        { status: 500 },
      );
    }
  };

export default catchAsyncHandler;

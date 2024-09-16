import { NextResponse } from "next/server";
import { disconnectFromDatabase } from "./connectDatabase";
import ErrorCreator from "./errorCreator";

/**
 * Wraps an asynchronous function to catch any errors and pass them to the next middleware.
 *
 * @param {Function} fn - The asynchronous function to be wrapped. This function should take the req object.
 * @returns {Function} - A new function that handles the execution of the async function and catches any errors.
 */
const catchAsyncHandler =
  (fn: (req: Request) => Promise<NextResponse>) => async (req: Request) => {
    try {
      const response = await fn(req);
      await disconnectFromDatabase();
      return response;
    } catch (error) {
      if (error instanceof ErrorCreator) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Internal Server Error";

        return NextResponse.json({
          statusCode: statusCode,
          message: message,
        });
      }
      await disconnectFromDatabase();
      return NextResponse.json({
        statusCode: 500,
        message: "An unexpected error occurred.",
      });
    }
  };

export default catchAsyncHandler;

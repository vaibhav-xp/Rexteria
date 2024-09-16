/**
 * Custom error class for creating error objects with a status code and message.
 * Extends the built-in Error class.
 *
 * @class
 * @extends Error
 */
class ErrorCreator extends Error {
  statusCode: number;

  /**
   * Creates an instance of ErrorCreator.
   *
   * @param {number} statusCode - The HTTP status code associated with the error.
   * @param {string} message - The error message.
   */
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode; // HTTP status code for the error

    // Ensure the name of the error is the same as the class name
    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ErrorCreator;

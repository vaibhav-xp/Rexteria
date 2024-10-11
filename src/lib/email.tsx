import nodemailer from "nodemailer";
import ErrorCreator from "./errorCreator";
import { StatusCodes } from "http-status-codes";

/**
 * Validates an email address using a regular expression.
 *
 * @param {String} email - The email address to validate.
 * @returns {Boolean} - Returns `true` if the email is valid, otherwise `false`.
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

/**
 * Creates mail options for sending an email.
 * @param {String} email - The recipient's email address.
 * @param {String} content - The HTML content of the email.
 * @param {String} Subject - Subject for the email.
 * @returns {Object} - Returns the mail options object.
 */
export const mailOptions = (
  email: string,
  subject: string,
  content: string
): object => {
  const senderEmail = process.env.EMAIL;

  if (!senderEmail) {
    throw new ErrorCreator(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Sender email is not defined in the environment variables."
    );
  }

  return {
    from: {
      name: "Rexteria - GTA 5 Mods",
      address: senderEmail,
    },
    to: email,
    subject: subject,
    html: content,
  };
};

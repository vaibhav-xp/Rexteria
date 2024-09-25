import { isValidEmail } from "@/lib/email";
import ErrorCreator from "@/lib/errorCreator";
import catchAsyncHandler from "@/lib/tryCatch";
import OTP from "@/models/otp.model";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import User from "@/models/user.model";
import jwt from "jsonwebtoken";
import ReturnNextResponse from "@/types/response-types";
import connectToDatabase from "@/lib/connectDatabase";
import { NextRequest } from "next/server";

export const POST = catchAsyncHandler(async (req: NextRequest) => {
  const formData = await req.formData();
  const email = formData.get("email") as string;
  const otp = formData.get("otp") as string;

  // Validate email and OTP presence
  if (!email || !otp) {
    throw new ErrorCreator(
      StatusCodes.BAD_REQUEST,
      "Email and OTP are required.",
    );
  }

  // Validate email format
  if (!isValidEmail(email)) {
    throw new ErrorCreator(StatusCodes.FORBIDDEN, "Invalid email address.");
  }

  // Find the OTP entry in the database
  await connectToDatabase();
  const otpEntry = await OTP.findOne({ email });
  if (!otpEntry) {
    throw new ErrorCreator(
      StatusCodes.FORBIDDEN,
      "No OTP found for this email.",
    );
  }

  // Check if the OTP has expired
  const currentTime = new Date();
  const expiresAt = new Date(otpEntry.expiresAt);
  if (currentTime > expiresAt) {
    await OTP.findOneAndDelete({ email });
    throw new ErrorCreator(StatusCodes.UNAUTHORIZED, "OTP has expired.");
  }

  // Verify the OTP
  const isVerified = await bcrypt.compare(otp, otpEntry.otp_code);
  if (!isVerified) {
    await OTP.findOneAndDelete({ email });
    throw new ErrorCreator(StatusCodes.UNAUTHORIZED, "Invalid OTP.");
  }

  // Clean up OTP entry after successful verification
  await OTP.findOneAndDelete({ email });

  // Find or create the user
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({
      email: email,
    });
    await user.save();
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.SECRET_ACCESS_TOKEN as string,
    { expiresIn: "24h" },
  );

  // Return success response
  const response = ReturnNextResponse(
    StatusCodes.OK,
    "User verified successfully.",
  );

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "strict",
    expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
  });

  return response;
});

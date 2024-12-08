import { isValidEmail, mailOptions, transporter } from "@/lib/email";
import ErrorCreator from "@/lib/errorCreator";
import catchAsyncHandler from "@/lib/tryCatch";
import OTP from "@/models/otp.model";
import ReturnNextResponse from "@/types/response-types";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { expiresOTP, generateOTP } from "@/lib/otp";
import connectToDatabase from "@/lib/connectDatabase";
import { NextRequest } from "next/server";
import { authRequired } from "@/lib/authRoute";
import { ROLES } from "@/middleware";
import User from "@/models/user.model";

export const POST = catchAsyncHandler(async (req: NextRequest) => {
  const formData = await req.formData();
  const email = formData.get("email") as string;

  if (!email) {
    throw new ErrorCreator(StatusCodes.BAD_REQUEST, "Email is required.");
  }

  // Validate email format
  if (!isValidEmail(email)) {
    throw new ErrorCreator(StatusCodes.BAD_REQUEST, "Invalid email address.");
  }

  await connectToDatabase();
  const isUserActive = await User.findOne({ email });

  if (isUserActive && !isUserActive?.active)
    throw new ErrorCreator(
      StatusCodes.BAD_REQUEST,
      "Your account has been blocked by the admin. Please contact the administrator for further assistance."
    );

  const otp = generateOTP();
  const salt = await bcrypt.genSalt(12);
  const hashOTP = await bcrypt.hash(otp.toString(), salt);

  try {
    const isOtpReceived = await OTP.findOne({ email });

    if (isOtpReceived) {
      // Update existing OTP entry
      isOtpReceived.otp_code = hashOTP;
      isOtpReceived.expiresAt = expiresOTP();
      await isOtpReceived.save();
    } else {
      // Create new OTP entry
      const newData = new OTP({
        email: email,
        otp_code: hashOTP,
        expiresAt: expiresOTP(),
      });
      await newData.save();
    }
  } catch (error) {
    console.log(error);
    throw new ErrorCreator(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to save OTP."
    );
  }

  // Prepare email content
  const subject = "Email OTP Verification - Rexteria";
  const content = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: auto;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h2 {
            color: #333;
          }
          .otp {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
            margin: 20px 0;
          }
          .footer {
            font-size: 12px;
            color: #777;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Email OTP Verification</h2>
          <p>Dear User,</p>
          <p>We have received a request to verify your email address. Please use the following OTP to complete the verification process:</p>
          <div class="otp">${otp}</div>
          <p>This OTP is valid for 15 minutes. If you did not request this verification, please ignore this email.</p>
          <div class="footer">
            Regards,<br>
            Rexteria Team
          </div>
        </div>
      </body>
    </html>
  `;

  // Send email
  try {
    await transporter.sendMail(mailOptions(email, subject, content));
  } catch (error) {
    console.log(error);
    throw new ErrorCreator(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to send OTP email."
    );
  }

  return ReturnNextResponse(
    StatusCodes.OK,
    "OTP sent successfully. It will be valid only for 15 minutes."
  );
});

export const GET = catchAsyncHandler(async (req) => {
  const response = await authRequired(req, [ROLES.ADMIN]);
  if (response) return response;

  const params = req.nextUrl.searchParams;
  const search = params.get("search");
  const limit = parseInt(params.get("limit") as string, 20) || 10;
  const page = parseInt(params.get("page") as string, 20) || 1;

  const query = {
    $or: [{ email: { $regex: search, $options: "i" } }],
  };
  const totalOTPs = await OTP.countDocuments(query);
  const totalPages = Math.ceil(totalOTPs / limit);

  const otps = await OTP.find(query)
    .skip((page - 1) * limit)
    .limit(limit);

  return ReturnNextResponse(
    StatusCodes.OK,
    "All users fetch who tries to login.",
    {
      otps,
      limit,
      page,
      totalPages,
      totalOTPs,
    }
  );
});

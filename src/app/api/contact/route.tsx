import { authRequired } from "@/lib/authRoute";
import connectToDatabase from "@/lib/connectDatabase";
import { mailOptions, transporter } from "@/lib/email";
import ErrorCreator from "@/lib/errorCreator";
import catchAsyncHandler from "@/lib/tryCatch";
import { ROLES } from "@/middleware";
import ContactModel from "@/models/contact.model";
import ReturnNextResponse from "@/types/response-types";
import { StatusCodes } from "http-status-codes";

export const POST = catchAsyncHandler(async (req) => {
  const formData = await req.formData();
  const name = formData.get("name");
  const phone = formData.get("phone");
  const email = formData.get("email") as string;
  const instagram = formData.get("instagram");
  const subject = formData.get("subject");
  const message = formData.get("message");

  await connectToDatabase();
  const isExist = await ContactModel.findOne({ email });
  if (isExist)
    throw new ErrorCreator(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "This email has already been used to submit a message. Please wait for our response.",
    );

  const newContact = new ContactModel({
    name,
    email,
    phone,
    instagram,
    subject,
    message,
  });

  const emailSubject = "We have received your message!";

  const content = `
  <p>Dear ${name},</p>

  <p>Thank you for reaching out to us. We have successfully received your message and will get back to you as soon as possible.</p>

  <p><strong>Summary of your submission:</strong></p>
  <ul>
    <li><strong>Name:</strong> ${name}</li>
    <li><strong>Email:</strong> ${email}</li>
    <li><strong>Phone:</strong> ${phone || "Not provided"}</li>
    <li><strong>Instagram:</strong> ${instagram || "Not provided"}</li>
    <li><strong>Subject:</strong> ${subject}</li>
    <li><strong>Message:</strong> ${message}</li>
  </ul>

  <p>If you need immediate assistance, feel free to reply to this email or contact us directly at our support center.</p>

  <br>
  <p>Best regards,</p>
  <p>Your Company Name</p>
`;

  // Send email
  try {
    await transporter.sendMail(mailOptions(email, emailSubject, content));
  } catch (error) {
    console.log(error);
    throw new ErrorCreator(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to send OTP email.",
    );
  }

  await newContact.save();
  return ReturnNextResponse(StatusCodes.OK, "Form Recieved Successfully.");
});

export const PATCH = catchAsyncHandler(async (req) => {
  const response = await authRequired(req, [ROLES.ADMIN]);
  if (response) return response;

  const formData = await req.formData();
  const contact_id = formData.get("contact_id");
  const status = formData.get("status");

  await connectToDatabase();
  await ContactModel.findByIdAndUpdate(contact_id, { $set: { status } });

  return ReturnNextResponse(StatusCodes.OK, "Status updated successfully.");
});

export const GET = catchAsyncHandler(async (req) => {
  const response = await authRequired(req, [ROLES.ADMIN]);
  if (response) return response;

  const search = req.nextUrl.searchParams.get("search") as string;
  const status = req.nextUrl.searchParams.get("status");
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10", 10);

  await connectToDatabase();

  const totalContacts = await ContactModel.countDocuments();
  const totalPages = Math.ceil(totalContacts / limit);

  const query = {
    $or: [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { message: { $regex: search, $options: "i" } },
      { instagram: { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
    ],
    ...(status && { status }),
  };

  const contacts = await ContactModel.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1))
    .lean();

  return ReturnNextResponse(StatusCodes.OK, "Contacts fetched successfully.", {
    limit,
    page,
    contacts,
    totalPages,
    totalContacts,
  });
});

export const DELETE = catchAsyncHandler(async (req) => {
  const response = await authRequired(req, [ROLES.ADMIN]);
  if (response) return response;

  const contact_id = (await req.formData()).get("contact_id");

  await connectToDatabase();
  await ContactModel.findByIdAndDelete(contact_id);

  return ReturnNextResponse(StatusCodes.OK, "Contact deleted successfully.");
});

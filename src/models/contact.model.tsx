import mongoose from "mongoose";
import { string } from "zod";

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
    },
    instagram: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ["seen", "unseen"],
      default: "unseen",
      required: true,
    },
  },
  { timestamps: true },
);

const ContactModel =
  mongoose.models.contact || mongoose.model("contact", ContactSchema);
export default ContactModel;

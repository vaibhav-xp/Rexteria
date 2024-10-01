import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    mods: [
      {
        mod_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "mod",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        totalAmount: {
          type: Number,
          required: true,
        },
      },
    ],
    message: {
      type: String,
    },
    pitchPrice: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["review", "hold", "completed"],
      default: "review",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: false,
    },
  },
);

const EnquiryModel =
  mongoose.models.enquiry || mongoose.model("enquiry", enquirySchema);

export default EnquiryModel;

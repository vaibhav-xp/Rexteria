import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    modeId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "mod",
        required: true,
      },
    ],
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    pitchPrice: {
      type: Number,
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

const Inquiry = mongoose.model("inquiry", inquirySchema);

module.exports = Inquiry;

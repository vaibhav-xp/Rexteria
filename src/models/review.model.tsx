import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    modId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mod",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    socialMediaLink: {
      type: String,
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

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;

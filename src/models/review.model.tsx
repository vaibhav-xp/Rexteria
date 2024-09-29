import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    mod_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "mod",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Boolean,
      default: false,
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

const ReviewModel =
  mongoose.models.review || mongoose.model("review", ReviewSchema);
export default ReviewModel;

import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "gallery",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const ModCategory =
  mongoose.models.categories || mongoose.model("categories", CategorySchema);

export default ModCategory;

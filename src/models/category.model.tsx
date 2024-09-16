import mongoose from "mongoose";
import ImageSchema from "./image.model";

const CategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: ImageSchema,
  },
  {
    timestamps: true,
  },
);

const ModCategory =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);

export default ModCategory;

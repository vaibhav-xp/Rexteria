import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema(
  {
    public_id: {
      type: String,
      required: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const GalleryModel =
  mongoose.models.gallery || mongoose.model("gallery", GallerySchema);
export default GalleryModel;

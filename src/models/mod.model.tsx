import mongoose from "mongoose";

const ModSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    specification: {
      type: String,
      required: true,
    },
    main_image: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "mod_category",
      required: true,
    },
    price: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    rating: {
      type: Number,
    },
    views: {
      type: Number,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "review",
      },
    ],
  },
  {
    timestamps: true,
    indexes: [
      {
        key: {
          categoryId: 1,
          views: 1,
          rating: 1,
        },
      },
    ],
  },
);

const Mod = mongoose.model("Mod", ModSchema);
export default Mod;

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
    specifications: [
      {
        type: {
          type: String,
        },
        value: {
          type: String,
        },
        _id: false,
      },
    ],
    content: {
      type: String,
    },
    main_image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "gallery",
      onDelete: "cascade",
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "gallery",
      },
    ],
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    price: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    discount_price: {
      type: Number,
    },
    rating: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    status: {
      type: Boolean,
      default: false,
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
          slug: 1,
        },
      },
    ],
  },
);

// ModSchema.pre(
//   "deleteOne",
//   { document: true, query: false },
//   async function (next) {
//     try {
//       // Remove the image reference from the product
//       await mongoose.model("Product").updateOne(
//         { _id: this.productId },
//         { $pull: { images: this._id } } // Remove the image ID from the images array
//       );
//       next();
//     } catch (err) {
//       next(err);
//     }
//   }
// );

const Mod = mongoose.models.mod || mongoose.model("mod", ModSchema);
export default Mod;

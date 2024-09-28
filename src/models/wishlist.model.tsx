import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  mods: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
});

const WishlistModel =
  mongoose.models.wishlist || mongoose.model("wishlist", WishlistSchema);

export default WishlistModel;

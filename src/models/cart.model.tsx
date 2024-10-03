import mongoose from "mongoose";

const CartModSchema = new mongoose.Schema(
  {
    mod_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "mod",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  },
);

// Main Cart schema
const CartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  mods: [CartModSchema],
  totalAmount: {
    type: Number,
    required: true,
    default: 0,
  },
});

const CartModel = mongoose.models.cart || mongoose.model("cart", CartSchema);
export default CartModel;

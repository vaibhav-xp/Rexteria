import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    country: {
      type: String,
    },
    phone: {
      type: Number,
    },
    youtube: {
      type: String,
    },
    instagram: {
      type: String,
      rquired: true,
    },
    x: {
      type: String,
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.models.user || mongoose.model("user", UserSchema);
export default User;

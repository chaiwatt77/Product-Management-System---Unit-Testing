import mongoose, { Schema } from "mongoose";

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: {
      createdAt: "joinedAt",
    },
  }
);

const users = mongoose.model("users", userSchema);
export default users

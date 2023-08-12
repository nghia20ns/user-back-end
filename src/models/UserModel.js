import mongoose from "mongoose";
import crypto from "crypto";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email_recover: {
      type: String,
    },
    access_token: {
      type: String,
      unique: true,
    },
    refresh_token: {
      type: String,
      unique: true,
    },
    api_key: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        return crypto.randomBytes(20).toString("hex");
      },
    },
    role: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);
export const User = mongoose.model("User", userSchema);

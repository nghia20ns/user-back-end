import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema(
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
    information: {
      type: String,
    },
    provider: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
    status: {
      type: Number,
      default: 0,
    },
    tranId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
export const Product = mongoose.model("Product", productSchema);

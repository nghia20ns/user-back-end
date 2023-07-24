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
      required: true,
      default: " ",
    },
    information: {
      type: String,
      required: true,
      default: " ",
    },
    provider: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
      default: " ",
    },
    status: {
      type: Number,
      default: 0,
    },
    tranId:{
      type: String,
    },
  }
);
export const Product = mongoose.model("Product", productSchema);

import mongoose from "mongoose";
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: "none",
    },
    status: {
      type: Number,
      default: 0,
    },
    products: [
      {
        email: {
          type: String,
        },
        password: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
  {
    // Sử dụng toObject và toJSON để loại bỏ _id trong products khi dữ liệu được chuyển đổi
    toObject: {
      transform: function (doc, ret) {
        if (ret.products && Array.isArray(ret.products)) {
          ret.products.forEach((product) => {
            delete product._id;
          });
        }
      },
    },
    toJSON: {
      transform: function (doc, ret) {
        if (ret.products && Array.isArray(ret.products)) {
          ret.products.forEach((product) => {
            delete product._id;
          });
        }
      },
    },
  }
);

export const Order = mongoose.model("Order", OrderSchema);

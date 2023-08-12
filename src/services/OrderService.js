import { Order } from "../models/OrderModel.js";
import { Product } from "../models/ProductModel.js";
import mongoose from "mongoose";

import { User } from "../models/UserModel.js";
export const detailOrderService = (transId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const findTrans = await Order.findById(transId).select("-products._id");
      if (findTrans) {
        resolve({
          data: findTrans,
        });
      }
      resolve({
        status: "error",
        message: "user is not defined",
      });
    } catch (error) {
      reject({
        status: "error",
        message: error,
      });
    }
  }).catch((e) => e);
};

export const createOrderService = ({ api_key, quantity, provider, id }) => {
  return new Promise(async (resolve, reject) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await User.findById(id);

      if (!user) {
        resolve({
          status: "error",
          message: "no user",
        });
        await session.abortTransaction();
      } else {
        const userId = user.id;
        const newTrans = await Order.create({
          userId,
          quantity,
          provider,
        });

        //change string to number
        const quantityNum = parseInt(quantity);

        //find total quantity product status = 0 in db
        const totalProduct = await Product.count({
          provider: provider,
          status: 0,
        });
        if (totalProduct < quantityNum) {
          //----huy gd---//
          const productLack = quantity - totalProduct;
          resolve({
            status: "error",
            message: "Missing " + productLack + " products",
          });
        } else {
          if (api_key === user.api_key) {
            //find products
            const products = await Product.find(
              { provider: provider, status: 0 },
              { email: 1, password: 1 }
            ).limit(quantity);
            const productIds = products.map((product) => product._id);
            await Order.findByIdAndUpdate(
              newTrans.id,
              {
                status: 1,
                products: products,
                message: "success",
              },
              { session }
            );
            await Product.updateMany(
              { _id: { $in: productIds } },
              { status: 1, tranId: newTrans.id },
              { session }
            );
            const getTransNew = await detailOrderService(newTrans.id);
            resolve({
              status: "enough",
              data: getTransNew,
            });
            //transaction success
            await session.commitTransaction();
            session.endSession();
          } else {
            // ---- Cancel the transaction ----
            resolve({
              status: "error",
              message: "api_key in valid",
            });
            await session.abortTransaction();
          }
        }
      }
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      reject({
        status: "error",
        message: error,
      });
    }
  }).catch((e) => e);
};
export const updateOrderService = (transId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const trans = await Order.findOne({ _id: transId });
      const totalProduct = await Product.count({
        provider: trans.provider,
        status: 0,
      });
      const products = await Product.find(
        { provider: trans.provider, status: 0 },
        { email: 1, password: 1 }
      ).limit(trans.quantity);

      const productIds = products.map((product) => product._id);
      if (totalProduct >= trans.quantity) {
        await Order.findByIdAndUpdate(transId, {
          status: 1,
          products: products,
        });
        await Product.updateMany(
          { _id: { $in: productIds } },
          { status: 1, tranId: transId }
        );

        resolve({
          status: "enough",
          message: "enough product",
        });
      } else if (totalProduct < trans.quantity) {
        const productLack = trans.quantity - totalProduct;
        resolve({
          status: "lack",
          message: "Missing " + productLack + " products",
        });
      }
    } catch (error) {
      reject({
        status: "error",
        message: error,
      });
    }
  }).catch((e) => e);
};
export const getOrderService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allTrans = await Order.find();
      resolve({
        data: allTrans,
      });
    } catch (error) {
      reject({
        status: "err",
        message: error,
      });
    }
  });
};
export const getDetailOrderService = (_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById(_id);
      if (order) {
        resolve({
          data: order,
        });
      } else {
        resolve({
          status: "no Order",
        });
      }
    } catch (error) {
      reject({
        status: "error",
        message: error,
      });
    }
  }).catch((e) => e);
};
export const getOrderPageService = (page) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalTrans = await Order.count();
      const allTrans = await Order.find()
        .skip((page - 1) * 10)
        .limit(10);
      resolve({
        data: allTrans,
        total: totalTrans,
        page: Math.ceil(totalTrans / 10),
      });
    } catch (error) {
      reject({
        status: "err",
        message: error,
      });
    }
  });
};

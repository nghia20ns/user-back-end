import { Transtraction } from "../models/TranstractionModel.js";
import { Product } from "../models/ProductModel.js";
import jwt from "jsonwebtoken";
import { User } from "../models/UserModel.js";
export const detailTranstractionService = (transId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const findTrans = await Transtraction.findById(transId);
      if (findTrans) {
        resolve({
          status: "find success",
          data: findTrans,
        });
      }
      resolve({
        status: "no user",
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

export const createTranstractionService = ({
  api_key,
  quantity,
  provider,
  id,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(id);
      if (api_key === user.api_key) {
        if (user) {
          const userId = user.id;

          const newTrans = await Transtraction.create({
            userId,
            quantity,
            provider,
          });
          ///--------------------
          let quantityNum = parseInt(quantity);
          const totalProduct = await Product.count({
            provider: provider,
            status: 0,
          });
          const products = await Product.find(
            { provider: provider, status: 0 },
            { email: 1, password: 1 }
          ).limit(quantity);

          const productIds = products.map((product) => product._id);
          if (totalProduct >= quantityNum) {
            await Transtraction.findByIdAndUpdate(newTrans.id, {
              status: 1,
              products: products,
            });
            await Product.updateMany(
              { _id: { $in: productIds } },
              { status: 1, tranId: newTrans.id }
            );
            const getTransNew = await detailTranstractionService(newTrans.id);

            resolve({
              status: "enough",
              data: getTransNew,
            });
          } else if (totalProduct < quantity) {
            const productLack = quantity - totalProduct;
            await Transtraction.findByIdAndUpdate(newTrans.id, {
              message: "missing product",
            });

            resolve({
              status: "lack",
              message: "Missing " + productLack + " products",
            });
          }
        } else {
          resolve({
            status: "no user",
            message: "no user",
          });
        }
      } else {
        resolve({
          status: "not api_key",
          message: "api_key in valid",
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
export const updateTranstractionService = (transId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const trans = await Transtraction.findOne({ _id: transId });
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
        await Transtraction.findByIdAndUpdate(transId, {
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
export const getTranstractionService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allTrans = await Transtraction.find();
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
export const getDetailTranstractionService = (_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const transtraction = await Transtraction.findById(_id);
      if (transtraction) {
        resolve({
          data: transtraction,
        });
      } else {
        resolve({
          status: "no transtraction",
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
export const getTranstractionPageService = (page) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalTrans = await Transtraction.count();
      const allTrans = await Transtraction.find()
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

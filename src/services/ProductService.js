import { Product } from "../models/ProductModel.js";
import { User } from "../models/UserModel.js";
import mongoose from "mongoose";
import { Order } from "../models/OrderModel.js";
import { detailOrderService } from "./OrderService.js";
import { Mutex, Semaphore, withTimeout } from "async-mutex";

export const createManyProductService = async (apiInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let d = 0;
      let message = "";
      for (let index of apiInput) {
        const product = await Product.findOne({ email: index.email });
        if (product) {
          d = 1;
          message += index.email + " ";
        }
      }
      if (d == 0) {
        const newProducts = await Product.create(apiInput);
        resolve({
          status: "success",
          message: "create success!",
          data: newProducts,
        });
      } else {
        resolve({
          status: "error",
          message: "Email already exists! ",
          data: message,
        });
      }
    } catch (error) {
      reject({
        status: "err",
        message: error,
      });
    }
  });
};
export const createProductService = async (data, api_key) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email: "admin@gmail.com" });
      if (api_key === user.api_key) {
        const isCheckEmail = await Product.find({ email: data.email });
        if (isCheckEmail.length) {
          resolve({
            status: "error",
            message: "the email and name is existed",
          });
        }
        //xu ly email co hop le
        const isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(data.email);
        if (isEmail) {
          const newProducts = await Product.create(data);
          resolve({
            status: "success",
            message: "create success!",
            data: newProducts,
          });
        } else {
          resolve({
            status: "error",
            message: "not email",
          });
        }
      } else {
        resolve({
          status: "error",
          message: "api key not found",
        });
      }
    } catch (error) {
      reject({
        status: "error",
        message: error,
      });
    }
  });
};
const Sort = (message) => {
  if (message === "ascending") {
    return 1;
  } else if (message === "decrease") {
    return -1;
  }
};
export const getAccountService = (page, limit, query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.count({
        email: { $regex: query.search, $options: "i" },
      });

      //insert object sortCriteria
      const sortCriteria = {};
      if (query.sortCreatedAt) {
        sortCriteria.createdAt = Sort(query.sortCreatedAt);
      }
      if (query.sortEmail) {
        sortCriteria.email = Sort(query.sortEmail);
      }
      if (query.sortProvider) {
        sortCriteria.provider = Sort(query.sortProvider);
      }
      if (query.sortStatus) {
        sortCriteria.status = Sort(query.sortStatus);
      }

      const allProduct = await Product.find({
        email: { $regex: query.search, $options: "i" },
      })
        .sort(sortCriteria)
        .skip((page - 1) * limit)
        .limit(limit);
      resolve({
        data: allProduct,
        total: totalProduct,
        page: Math.ceil(totalProduct / limit),
      });
    } catch (error) {
      reject({
        status: "err",
        message: error,
      });
    }
  });
};
export const detailProductService = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const findProduct = await Product.findById(productId);
      if (findProduct) {
        resolve({
          status: "find success",
          data: findProduct,
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

export const deleteProductService = (_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const deleteProduct = await Product.findByIdAndDelete(_id);
      if (deleteProduct) {
        resolve({
          status: "ok",
          data: deleteProduct,
        });
      } else {
        resolve({
          status: "err",
          message: "user not define",
        });
      }
    } catch (error) {
      reject({
        status: "err",
        message: error,
      });
    }
  });
};

export const updateProductService = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(data.email);
      if (isEmail) {
        const updateProduct = await Product.findByIdAndUpdate(id, data);

        if (updateProduct) {
          const getProductNew = await detailProductService(id);
          resolve({
            status: "update ok",
            data: getProductNew,
          });
        } else {
          resolve({
            status: "error",
            message: "the user not define",
          });
        }
      } else {
        resolve({
          status: "error",
          message: "user not email",
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

const mutex = new Mutex();
export const buyService = async (api_key, quantity, provider) => {
  return new Promise(async (resolve, reject) => {
    const release = await mutex.acquire();

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await User.findOne({ api_key: api_key });

      if (!user) {
        resolve({
          status: "error",
          message: "api_key in valid",
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
          $or: [
            {
              $expr: {
                $gt: [
                  {
                    $subtract: [new Date(), "$createdAt"],
                  },
                  3600000,
                ],
              },
            },
            { email_recover: { $ne: null } },
          ],
        });
        console.log(totalProduct);
        //   provider: provider,
        //   status: 0,
        //   $or: [
        //     {
        //       $expr: {
        //         $gt: [
        //           {
        //             $subtract: [new Date(), "$createdAt"]
        //           },
        //           3600000
        //         ]
        //       }
        //     },
        //     {
        //       email_recover: { $ne: null }
        //     }
        //   ]
        // });

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
            const products = await Product.find({
              provider: provider,
              status: 0,
              $or: [
                {
                  $expr: {
                    $gt: [
                      {
                        $subtract: [new Date(), "$createdAt"],
                      },
                      3600000,
                    ],
                  },
                },
                { email_recover: { $ne: null } },
              ],
            }).limit(quantity);
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
            //transaction success
            await session.commitTransaction();
            session.endSession();
            const getTransNew = await detailOrderService(newTrans.id);
            let email;
            const emails = [];
            for (const i of getTransNew.data.products) {
              email = {
                Email: i.email,
                Password: i.password,
              };
              emails.push(email);
            }

            // const emails = getTransNew.data.products;
            resolve({
              Code: getTransNew.data.status,
              Message: "thành công",
              Data: {
                TransId: getTransNew.data._id,
                Product: getTransNew.data.provider,
                Quantity: getTransNew.data.quantity,
                Emails: emails,
              },
            });
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
    } finally {
      release();
    }
  }).catch((e) => e);
};

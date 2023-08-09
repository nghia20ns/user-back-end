import { Product } from "../models/ProductModel.js";

export const createProductService = async (apiInput) => {
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
      console.log(error.name);
      reject({
        status: "err",
        message: error,
      });
    }
  });
};
export const getProductService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.count();
      const allProduct = await Product.find().sort({ status: 1 });
      resolve({
        data: allProduct,
        total: totalProduct,
      });
    } catch (error) {
      reject({
        status: "err",
        message: error,
      });
    }
  });
};
export const getProductPageService = (page, search) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.count();

      if (search) {
        const allProduct = await Product.find({
          email: { $regex: search, $options: "i" },
        })
          .skip((page - 1) * 10)
          .limit(10);
        resolve({
          data: allProduct,
          total: totalProduct,
          page: Math.ceil(totalProduct / 10),
        });
      } else {
        const allProduct = await Product.find()
          .skip((page - 1) * 10)
          .limit(10);
        resolve({
          data: allProduct,
          total: totalProduct,
          page: Math.ceil(totalProduct / 10),
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
export const detailProductService = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(productId);
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

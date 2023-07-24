import { Product } from "../models/ProductModel.js";

export const createProductService = async (apiInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      const newProducts = await Product.insertMany(apiInput.apiInput);
      resolve( {
        status: "success",
        message: "Đã thêm dữ liệu thành công!",
        data: newProducts,
      });
    } catch (error) {
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
        const allProduct = await Product.find().sort({ status: 1 });;
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
  export const getProductPageService = (page,search) => {
    return new Promise(async (resolve, reject) => {
      try {
        const totalProduct = await Product.count();

        if (search) {
            const allProduct = await Product.find({ email: { $regex: search, $options: "i" } })
            .skip((page - 1) * 10)
            .limit(10);
          resolve({
            data: allProduct,
            total: totalProduct,
            page: Math.ceil(totalProduct / 10),
          });
        }else{
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
        const product = await Product.findById(id);
        const isCheckEmail = await Product.findOne({
          email_recover: data.email_recover,
        });
        const isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(
          data.email_recover
        );
        if (isEmail) {
          if (isCheckEmail) {
            resolve({
              status: "email already exists",
              message: "the email already exists",
            });
          } else {
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
          }
        } else {
          resolve({
            status: "error email",
            message: "Please enter the correct email",
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
  
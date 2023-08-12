import { User } from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { Product } from "../models/ProductModel.js";

export const getInformationService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const findUser = await User.findById(id, { api_key: 0, role: 0 });
      if (findUser) {
        resolve({
          status: "find success",
          data: findUser,
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

export const checkTokenService = (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, user) {
        if (!token) {
          resolve({
            status: "please login",
            message: "the token is invalid",
          });
        }
        if (err) {
          if (err.name === "JsonWebTokenError") {
            resolve({
              status: "please login",
              message: "the token has error",
            });
          }
          if (err.name === "TokenExpiredError") {
            resolve({
              status: "token expired",
              message: "the token has expired",
            });
          }
        } else if (user.role === 0 || user.role === 1 || user.role === 2) {
          resolve({
            status: "token valid",
            message: "token valid",
          });
        } else {
          resolve({
            status: "please login",
            message: "the user is not authorized",
          });
        }
      });
    } catch (error) {
      reject({
        status: "error",
        message: error,
      });
    }
  }).catch((e) => e);
};
export const getAccountService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      //find total quantity product status = 0 in db
      const hotmailNotSold = await Product.count({
        provider: "hotmail",
        status: 0,
      });
      const gmailNotSold = await Product.count({
        provider: "gmail",
        status: 0,
      });
      const hotmailSold = await Product.count({
        provider: "hotmail",
        status: 1,
      });
      const gmailSold = await Product.count({
        provider: "gmail",
        status: 1,
      });
      const totalHotmail = await Product.count({
        provider: "hotmail",
      });
      const totalGmail = await Product.count({
        provider: "gmail",
      });
      resolve({
        totalHotmail: totalHotmail,
        totalGmail: totalGmail,
        hotmailNotSold: hotmailNotSold,
        gmailNotSold: gmailNotSold,
        hotmailSold: hotmailSold,
        gmailSold: gmailSold,
      });
    } catch (error) {
      reject({
        status: "error",
        message: error,
      });
    }
  }).catch((e) => e);
};

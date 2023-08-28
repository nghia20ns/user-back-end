import { User } from "../models/UserModel.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const createUserService = ({ email, password }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isCheckEmail = await User.find({ email: email });
      if (isCheckEmail.length) {
        resolve({
          status: "email existed",
          message: "the email and name is existed",
        });
      }
      //ma hoa pass
      const hashPassword = bcrypt.hashSync(password, 10);

      //xu ly email co hop le
      const isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email);
      if (isEmail) {
        const newUser = await User.create({
          email,
          password: hashPassword,
        });
        const { password, ...rest } = newUser;
        resolve({
          status: "sign success",
          message: "signup success, please login",
          data: {
            email: newUser.email,
          },
        });
      } else {
        resolve({
          status: "error email",
          message: "username is not email",
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
export const detailUserService = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const findUser = await User.findById(userId);
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
export const changePasswordService = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(id);
      const hashPassword = bcrypt.hashSync(data.password, 10);
      const checkPassword = bcrypt.compareSync(data.password, user.password);
      if (checkPassword) {
        resolve({
          status: "same password",
          message: "Password must not be the same as the old password",
        });
      } else {
        const updateUser = await User.findByIdAndUpdate(id, {
          password: hashPassword,
        });
        if (updateUser) {
          const getUserNew = await detailUserService(id);
          resolve({
            status: "update ok",
            data: getUserNew,
          });
        } else {
          resolve({
            status: "error",
            message: "the user not define",
          });
        }
      }
    } catch (error) {
      reject({
        status: "error",
        message: error,
      });
    }
  }).catch((e) => e);
};
export const getUserService = (page) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalUser = await User.count();
      const allUser = await User.find()
        .skip((page - 1) * 10)
        .limit(10);
      resolve({
        data: allUser,
        total: totalUser,
        page: Math.ceil(totalUser / 10),
      });
    } catch (error) {
      reject({
        status: "err",
        message: error,
      });
    }
  });
};
export const getAllUserService = (page) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalUser = await User.count();
      const allUser = await User.find();
      resolve({
        data: allUser,
        total: totalUser,
      });
    } catch (error) {
      reject({
        status: "err",
        message: error,
      });
    }
  });
};
export const deleteUserService = (_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const deleteUser = await User.findByIdAndDelete(_id);
      if (deleteUser) {
        resolve({
          status: "ok",
          data: deleteUser,
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

export const addEmailRecoverService = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isCheckEmail = await User.findOne({
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
          const updateUser = await User.findByIdAndUpdate(id, data);
          if (updateUser) {
            const getUserNew = await detailUserService(id);
            resolve({
              status: "update ok",
              data: getUserNew,
            });
          } else {
            resolve({
              status: "the user not define",
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
export const userUpdateService = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(id);
      const hashPassword = bcrypt.hashSync(data.password, 10);
      const isCheckEmail = await User.findOne({
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
          const updateUser = await User.findByIdAndUpdate(id, {
            email_recover: data.email_recover,
            password: hashPassword,
          });
          if (updateUser) {
            const getUserNew = await detailUserService(id);
            resolve({
              status: "update ok",
              data: getUserNew,
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

///login ------------------------//

const generalAccessToken = (data) => {
  const access_token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
  return access_token;
};
const generalRefreshToken = (data) => {
  const refresh_token = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return refresh_token;
};

export const loginService = ({ email, password }) => {
  return new Promise(async (resolve, reject) => {
    const isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email);
    if (isEmail) {
      const userDB = await User.find({ email: email });
      if (userDB.length) {
        const checkPassword = bcrypt.compareSync(password, userDB[0].password);
        if (checkPassword) {
          const access_token = generalAccessToken({
            role: userDB[0].role,
            _id: userDB[0]._id,
          });
          const refresh_token = generalRefreshToken({
            role: userDB[0].role,
            _id: userDB[0]._id,
          });

          resolve({
            status: "success",
            data: {
              access_token,
              refresh_token,
            },
          });
        }
        resolve({
          status: "error",
          message: "username or password is wrong",
        });
      } else {
        resolve({
          status: "error",
          message: "the email not existed",
        });
      }
    } else {
      resolve({
        status: "error",
        message: "the email not valid",
      });
    }
  });
};
export const refreshTokenService = (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, function (err, user) {
        if (err) {
          resolve(404).json({
            message: "the user is not auth",
          });
        }
        if (user) {
          const newAccessToken = generalAccessToken({
            isAdmin: user.isAdmin,
            _id: user._id,
          });
          resolve({
            status: "OK",
            access_token: newAccessToken,
          });
        } else {
          resolve({
            message: "the user is not auth",
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const changeApiKeyService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const newApiKey = crypto.randomBytes(20).toString("hex");
      const updateUser = await User.findByIdAndUpdate(id, {
        api_key: newApiKey,
      });
      if (updateUser) {
        const getUserNew = await detailUserService(id);
        resolve({
          status: "update ok",
          data: getUserNew,
        });
      } else {
        resolve({
          status: "the user not define",
          message: "the user not define",
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

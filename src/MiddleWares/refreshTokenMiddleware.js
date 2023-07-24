import e from "express";
import jwt from "jsonwebtoken";
const refreshTokenMiddleWare = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, function (err, user) {
    if (!token) {
      return res.json({
        message: "the token is in valid",
      });
    }

    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.json({
          status :"token expried",
          message: "the token is expried",
        });
  
      }
    }else{
      next()
    }
  });
};
export default refreshTokenMiddleWare;

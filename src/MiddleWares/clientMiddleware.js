import jwt from "jsonwebtoken";

const clientMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.json({
      status: "please login",
      message: "Authorization header missing",
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, user) {
    if (!token) {
      return res.json({
        status: "please login",
        message: "the token is invalid",
      });
    }

    if (err) {
      if (err.name === "JsonWebTokenError") {
        return res.json({
          status: "please login",
          message: "the token has error",
        });
      }

      if (err.name === "TokenExpiredError") {
        return res.json({
          status: "token expired",
          message: "the token has expired",
        });
      }
    } else if (user.role === 0 || user.role === 1 || user.role === 2) {
      req.user = user;
      next();
    } else {
      return res.json({
        status: "please login",
        message: "the user is not authorized",
      });
    }
  });
};

export default clientMiddleware;

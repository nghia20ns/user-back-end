import jwt from "jsonwebtoken";
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, user) {
    if (!token) {
      return res.json({
        status: "please login",
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
    }
    else if (user.role === 2) {
      req.user = user;
      next();
    } else {
      return res.json({
        status: "please login",
        message: "the user is not auth",
      });
    }
  });
};
export default authMiddleware;

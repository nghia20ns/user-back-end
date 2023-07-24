import jwt from "jsonwebtoken";
const bymailMiddleware = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, user) {
    if (!token) {
      return res.json({
        message: "the token is in valid",
      });
    }else{
        if (err) {
            if (err.name === "TokenExpiredError") {
              return res.json({
                status :"token expried",
                message: "the token is expried",
              });
        
            }
          }else{
              req.user = user;
              next();
          }
      
    }
  });
};
export default bymailMiddleware;

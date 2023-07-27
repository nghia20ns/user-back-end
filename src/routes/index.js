import userRouter from "./UserRoute.js";
import productRouter from "./ProductRoute.js";
import transtractionRouter from "./TranstractionRoute.js";

const routes = (app) => {
  
  app.use("/api/product", productRouter);
  app.use("/api/transtraction", transtractionRouter);
  app.use("/api/user", userRouter);

};
export default routes;

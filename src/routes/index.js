import userRouter from "./UserRoute.js";
import productRouter from "./ProductRoute.js";
import transtractionRouter from "./TranstractionRoute.js";

const routes = (app) => {
  app.use("/product", productRouter);
  app.use("/transtraction", transtractionRouter);

  app.use("/user", userRouter);
};
export default routes;

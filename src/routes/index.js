import userRouter from "./UserRoute.js";
import productRouter from "./ProductRoute.js";
import orderRouter from "./OrderRouter.js";

const routes = (app) => {
  app.use("/api/products", productRouter);
  app.use("/api/users", userRouter);
  app.use("/api/orders", orderRouter);
};
export default routes;

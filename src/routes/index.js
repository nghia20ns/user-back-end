import userRouter from "./UserRoute.js";
import productRouter from "./ProductRoute.js";
import orderRouter from "./OrderRoute.js";
import clientRouter from "./ClientRoute.js";

const routes = (app) => {
  app.use("/api/products", productRouter);
  app.use("/api/users", userRouter);
  app.use("/api/orders", orderRouter);
  app.use("/api/clients", clientRouter);
};
export default routes;

import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import routes from "./routes/index.js";
dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(express.json());

//connect MongoDB
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("db success");
  })
  .catch((err) => {
    console.log(err);
  });
app.use((req, res, next) => {
  console.log(req);
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE, PATCH`);
  res.header(`Access-Control-Allow-Headers`, `*`);
  next();
});
routes(app);
app.listen(port, () => {
  console.log("Server running in port: ", port);
});

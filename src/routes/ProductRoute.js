import express from "express";
import {
  createManyProductController,
  getProductController,
  getProductPageController,
  detailsProductController,
  deleteProductController,
  updateProductController,
  createProductController,
  buyController,
} from "../controllers/ProductController.js";
import authMiddleware from "../MiddleWares/authMiddleware.js";
import adminMiddleware from "../MiddleWares/adminMiddleware.js";

const router = express.Router();
router.get("/buy/", buyController);

router.get("/:productId", detailsProductController);
router.get("/getall", getProductController);
router.post("/createMany", createManyProductController);
router.post("/create", createProductController);
router.get("/getall/:page", authMiddleware, getProductPageController);
router.get("/detail/:page", authMiddleware, getProductPageController);
router.delete("/delete/:productId", deleteProductController);
router.patch("/update/:id", updateProductController);

export default router;

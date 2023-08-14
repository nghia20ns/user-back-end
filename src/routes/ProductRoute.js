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
  getAccountController,
} from "../controllers/ProductController.js";
import authMiddleware from "../MiddleWares/authMiddleware.js";

const router = express.Router();
router.get("/buy/", buyController);

router.get("/:productId", detailsProductController);
// router.get("/getall", getProductController);
router.post("/createMany", createManyProductController);
router.post("/create", createProductController);
// router.get("/getall/:page", authMiddleware, getProductPageController);
// router.get("/detail/:page", authMiddleware, getProductPageController);
router.delete("/delete/:productId", deleteProductController);
router.patch("/update/:id", updateProductController);
router.get("/get/:page/:limit/", authMiddleware, getAccountController);

export default router;

import express from "express";
import {
    createProductController,
    getProductController,
    getProductPageController,
    detailsProductController,
    deleteProductController,
    updateProductController
  } from "../controllers/ProductController.js";
import authMiddleware from "../MiddleWares/authMiddleware.js";
import adminMiddleware from "../MiddleWares/adminMiddleware.js";
  
const router = express.Router();
router.get("/:productId", detailsProductController);
router.get("/getall", getProductController);
router.post("/create",createProductController);
router.get("/getall/:page",authMiddleware, getProductPageController);
router.get("/detail/:page",authMiddleware, getProductPageController);
router.delete("/delete/:productId", deleteProductController);
router.patch("/update/:productId", updateProductController);

export default router;

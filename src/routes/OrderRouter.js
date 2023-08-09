import express from "express";
import {
  createOrderController,
  updateOrderController,
  getOrderController,
  getDetailOrderController,
  getOrderPageController,
} from "../controllers/OrderController.js";
import orderMiddleWare from "../MiddleWares/orderMiddleWare.js";
import authMiddleware from "../MiddleWares/authMiddleware.js";

const router = express.Router();
router.get("/getall/", authMiddleware, getOrderController);
router.get("/getall/:page", authMiddleware, getOrderPageController);

router.get("/:tranId", getDetailOrderController);

router.post("/create", orderMiddleWare, createOrderController);
router.patch("/update/:tranId", updateOrderController);

export default router;

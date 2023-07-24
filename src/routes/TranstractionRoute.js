import express from "express";
import {
    createTranstractionController,
    updateTranstractionController,
    getTranstractionController,
    getDetailTranstractionController,
    getTranstractionPageController
  } from "../controllers/TranstractionController.js";
import bymailMiddleware from "../MiddleWares/bymailMiddleware.js";
import authMiddleware from "../MiddleWares/authMiddleware.js";
  
const router = express.Router();
router.get("/getall/",authMiddleware,getTranstractionController);
router.get("/getall/:page",authMiddleware,getTranstractionPageController);

router.get("/:tranId",getDetailTranstractionController);

router.post("/create",bymailMiddleware,createTranstractionController);
router.patch("/update/:tranId", updateTranstractionController);

export default router;

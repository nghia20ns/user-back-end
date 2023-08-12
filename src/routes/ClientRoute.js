import express from "express";
import {
  getInformationController,
  checkTokenController,
  getAccountController,
} from "../controllers/ClientController.js";
import clientMiddleware from "../MiddleWares/clientMiddleware.js";
const router = express.Router();
router.get("/getInformation", clientMiddleware, getInformationController);
router.get("/checkToken", checkTokenController);
router.get("/getAccount", getAccountController);

export default router;

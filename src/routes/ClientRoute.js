import express from "express";
import multer from "multer";

import {
  getInformationController,
  checkTokenController,
  getAccountController,
  changePasswordController,
  uploadProfileController,
} from "../controllers/ClientController.js";
import clientMiddleware from "../MiddleWares/clientMiddleware.js";
const router = express.Router();
const upload = multer(); // Tạo biến upload bằng multer middleware

router.get("/getInformation", clientMiddleware, getInformationController);
router.get("/checkToken", checkTokenController);
router.get("/getAccount", getAccountController);
router.post("/changePassword/", clientMiddleware, changePasswordController);
router.post(
  "/uploadProfile",
  upload.single("filename"),
  uploadProfileController
);

export default router;

import express from "express";
import {
  getAllUserController,
  createUserController,
  detailsUserController,
  changePasswordController,
  deleteUserController,
  addEmailRecoverController,
  userUpdateController,
  getUserController,
  loginController,
  userRefreshTokenController,
  changeApiKeyController,
} from "../controllers/UserController.js";
import authMiddleware from "../MiddleWares/authMiddleware.js";
import refreshTokenMiddleWare from "../MiddleWares/refreshTokenMiddleware.js";
const router = express.Router();
router.get("/getUser/", authMiddleware, getAllUserController);
router.get("/getUser/:page", authMiddleware, getUserController);
router.post("/signup", createUserController);
router.patch("/userUpdate/:id", authMiddleware, userUpdateController);
router.patch("/addEmailRecover/:id", addEmailRecoverController);
router.delete("/delete/:id", authMiddleware, deleteUserController);
router.post("/login", loginController);
router.post(
  "/refreshToken",
  refreshTokenMiddleWare,
  userRefreshTokenController
);
export default router;

router.get("/:userId", authMiddleware, detailsUserController);
router.patch("/changePassword/:id", changePasswordController);
router.patch("/changeApiKey/:id", authMiddleware, changeApiKeyController);

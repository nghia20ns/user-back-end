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
router.get("/getUser/", authMiddleware,getAllUserController);
router.get("/getUser/:page", authMiddleware,getUserController);
router.post("/signup", createUserController);
router.get("/:userId", detailsUserController);
router.patch("/changePassword/:id", changePasswordController);
router.patch("/changeApiKey/:id", changeApiKeyController);

router.patch("/userUpdate/:id", userUpdateController);
router.patch("/addEmailRecover/:id", addEmailRecoverController);
router.delete("/delete/:id", deleteUserController);
router.post("/login",loginController);
router.post('/refreshToken',refreshTokenMiddleWare, userRefreshTokenController)
export default router;

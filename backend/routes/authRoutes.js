import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

export default router;

import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateProfile,
  allUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../controllers/authController.js";
import { isAuthenticatedUser } from "../middlewares/authRoutes.js";
import { authorizedRoles } from "../middlewares/authRoutes.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

router.get("/me", isAuthenticatedUser, getUserProfile);
router.put("/password/update", isAuthenticatedUser, updatePassword);
router.put("/profile/update", isAuthenticatedUser, updateProfile);
router.get("/users", isAuthenticatedUser, authorizedRoles("admin"), allUsers);
router.get(
  "/users/:id",
  isAuthenticatedUser,
  authorizedRoles("admin"),
  getUserById,
);
router.put(
  "/users/:id",
  isAuthenticatedUser,
  authorizedRoles("admin"),
  updateUserById,
);
router.delete(
  "/users/:id",
  isAuthenticatedUser,
  authorizedRoles("admin"),
  deleteUserById,
);

export default router;

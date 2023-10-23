import express from "express";
const router = express.Router();
import { isAuthenticatedUser } from "../middlewares/authRoutes.js";
import { authorizedRoles } from "../middlewares/authRoutes.js";
import {
  newOrder,
  getCurrentUserOrders,
  getAllOrders,
  updateOrder,
  getOrderDetails,
  deleteOrder,
} from "../controllers/orderController.js";

router.post("/orders/new", isAuthenticatedUser, newOrder);
router.get("/orders/:id", isAuthenticatedUser, getOrderDetails);
router.get("/me/orders", isAuthenticatedUser, getCurrentUserOrders);

router.get(
  "/admin/orders",
  isAuthenticatedUser,
  authorizedRoles("admin"),
  getAllOrders,
);
router.put(
  "/admin/orders/:id",
  isAuthenticatedUser,
  authorizedRoles("admin"),
  updateOrder,
);
router.delete(
  "/admin/orders/:id",
  isAuthenticatedUser,
  authorizedRoles("admin"),
  deleteOrder,
);

export default router;

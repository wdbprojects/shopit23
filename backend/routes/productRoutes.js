import express from "express";
const router = express.Router();
import {
  getProducts,
  newProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import {
  authorizedRoles,
  isAuthenticatedUser,
} from "../middlewares/authRoutes.js";

/* UNPROTECTED ROUTES */
router.get("/products", getProducts);
router.get("/products/:id", getProductById);

/* PROTECTED ROUTES */
router.post(
  "/admin/products",
  isAuthenticatedUser,
  authorizedRoles("admin"),
  newProduct,
);
router.put(
  "/admin/products/:id",
  isAuthenticatedUser,
  authorizedRoles("admin"),
  updateProduct,
);
router.delete(
  "/admin/products/:id",
  isAuthenticatedUser,
  authorizedRoles("admin"),
  deleteProduct,
);

export default router;

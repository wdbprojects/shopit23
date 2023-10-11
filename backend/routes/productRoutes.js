import express from "express";
const router = express.Router();
import {
  getProducts,
  newProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

router.get("/products", getProducts);
router.post("/admin/products", newProduct);
router.get("/products/:id", getProductById);
router.put("/admin/products/:id", updateProduct);
router.delete("/admin/products/:id", deleteProduct);

export default router;

const express = require("express");
const router = express.Router();
const {
  createProduct,
  allProducts,
  oneProduct,
  updateProduct,
  softDelete,
  restoreProduct,
  deletePermanent,
} = require("../Controllers/productController");

const authMiddleware = require("../Middleware/authMiddleware");

router.post("/api/products", authMiddleware, createProduct);
router.get("/api/products", authMiddleware, allProducts);
router.get("/api/products/:id", authMiddleware, oneProduct);
router.put("/api/products/:id", authMiddleware, updateProduct);
router.put("/api/products/delete/:id", authMiddleware, softDelete);
router.put("/api/products/restore/:id", authMiddleware, restoreProduct);
router.delete("/api/products/permanent/:id", authMiddleware, deletePermanent);

module.exports = router;

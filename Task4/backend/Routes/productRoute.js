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

router.post("/api/products", createProduct);
router.get("/api/products", allProducts);
router.get("/api/products/:id", oneProduct);
router.put("/api/products/:id", updateProduct);
router.put("/api/products/delete/:id", softDelete);
router.put("/api/products/restore/:id", restoreProduct);
router.delete("/api/products/permanent/:id", deletePermanent);

module.exports = router;

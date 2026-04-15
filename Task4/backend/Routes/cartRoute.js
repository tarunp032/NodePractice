const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCartItems,
  increaseCartItem,
  decreaseCartItem,
  removeCartItem,
  getCartSummary,
} = require("../Controllers/cartController");

const authMiddleware = require("../Middleware/authMiddleware");

router.get("/", authMiddleware, getCartItems);
router.get("/summary", authMiddleware, getCartSummary);
router.post("/add", authMiddleware, addToCart);
router.put("/increase/:productId", authMiddleware, increaseCartItem);
router.put("/decrease/:productId", authMiddleware, decreaseCartItem);
router.delete("/remove/:productId", authMiddleware, removeCartItem);

module.exports = router;
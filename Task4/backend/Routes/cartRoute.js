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

router.get("/", getCartItems);
router.get("/summary", getCartSummary);

router.post("/add", addToCart);
router.put("/increase/:productId", increaseCartItem);
router.put("/decrease/:productId", decreaseCartItem);
router.delete("/remove/:productId", removeCartItem);

module.exports = router;
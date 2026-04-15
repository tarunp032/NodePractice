const express = require("express");
const router = express.Router();

const {
  signup,
  loginUser,
  getProfile,
  forgotPassword,
  resetPassword,
} = require("../Controllers/userController");

const authMiddleware = require("../Middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", loginUser);
router.get("/profile/:userId", authMiddleware, getProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", authMiddleware, resetPassword);

module.exports = router;
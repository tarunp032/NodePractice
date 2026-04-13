const express = require("express");
const router = express.Router();

const {
  signup,
  loginUser,
  getProfile,
  forgotPassword,
  resetPassword,
} = require("../Controllers/userController");

router.post("/signup", signup);
router.post("/login", loginUser);
router.get("/profile/:userId", getProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
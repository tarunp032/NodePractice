const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

const secretKey = "abcxyz1234";

module.exports = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    console.log(">> authToken =", authToken);

    if (!authToken) {
      return res.status(401).json({
        success: false,
        message: "Token not found",
      });
    }

    const token = authToken.split(" ")[1];
    console.log(">> token =", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const verifyToken = jwt.verify(token, secretKey);
    console.log(">> verifyToken =", verifyToken);

    if (!verifyToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid user",
      });
    }

    const email = verifyToken.email;
    const userDetail = await User.findOne({ email });

    console.log(">> userDetail =", userDetail);

    if (!userDetail) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = userDetail;
    next();
  } catch (error) {
    console.log("Auth Middleware Error:", error);
    return res.status(401).json({
      success: false,
      message: "Token expired or invalid",
    });
  }
};

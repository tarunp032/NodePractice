const secretKey = "abcxyz1234";
const jwt = require("jsonwebtoken");
const user = require("../Models/userModel");

module.exports = async (req, res, next) => {
  const authToken = req.headers.authorization;
  console.log(`>>authToken`, authToken);

  if (!authToken) {
    return res.status(401).json({ message: "token not found" });
  }
  const token = authToken.split(" ")[1];
  console.log(`>>>token`, token);
  if (!token) {
    return res.status(401).json({ message: "invalid token" });
  }

  const verifyToken = jwt.verify(token, secretKey);
  console.log(`>>>verifyToken`, verifyToken);

  if (!verifyToken) {
    return res.status(401).json({ message: "invalid user" });
  }
  const email = verifyToken.email;
  const userDetail = await user.findOne({ email });
  console.log(`>>>userDetail`, userDetail);

  if (!userDetail``) {
    return res.status(401).json({ message: "User not found" });
  }
  req.user = userDetail;
  next();
};

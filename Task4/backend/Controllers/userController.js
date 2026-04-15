const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "abcxyz1234";

const signup = async (req, res) => {
  const { name, email, age, password, phone, gender, city, address } = req.body;

  if (!name || !email || !password || !phone || !gender || !city || !address) {
    return res.status(400).json({
      success: false,
      message: "Please fill all required fields",
    });
  }

  const oldUser = await User.findOne({ email: email.toLowerCase() });

  if (oldUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const data = {
    name,
    email: email.toLowerCase(),
    age,
    password: hash,
    phone,
    gender,
    city,
    address,
  };

  const newUser = new User(data);
  await newUser.save();

  return res.status(201).json({
    success: true,
    message: "Signup successful",
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      age: newUser.age,
      phone: newUser.phone,
      gender: newUser.gender,
      city: newUser.city,
      address: newUser.address,
      status: newUser.status,
    },
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const oldUser = await User.findOne({ email: email.toLowerCase() });

  if (!oldUser) {
    return res.status(404).json({
      success: false,
      message: "User not found, please signup first",
    });
  }

  const match = await bcrypt.compare(password, oldUser.password);

  if (!match) {
    return res.status(401).json({
      success: false,
      message: "Wrong password",
    });
  }

  const token = jwt.sign(
    {
      email: oldUser.email,
    },
    secretKey,
    { expiresIn: "2h" },
  );

  return res.status(200).json({
    success: true,
    message: "Login successful",
    token: token,
    user: {
      _id: oldUser._id,
      name: oldUser.name,
      email: oldUser.email,
      age: oldUser.age,
      phone: oldUser.phone,
      gender: oldUser.gender,
      city: oldUser.city,
      address: oldUser.address,
      status: oldUser.status,
    },
  });
};

const getProfile = async (req, res) => {
  const { userId } = req.params;

  if (String(req.user._id) !== String(userId)) {
    return res.status(403).json({
      success: false,
      message: "You can access only your own profile",
    });
  }

  const foundUser = await User.findById(userId).select("-password");

  if (!foundUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    user: foundUser,
  });
};

const forgotPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Email, new password and confirm password are required",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "New password and confirm password do not match",
    });
  }

  const foundUser = await User.findOne({ email: email.toLowerCase() });

  if (!foundUser) {
    return res.status(404).json({
      success: false,
      message: "User not found with this email",
    });
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(newPassword, salt);

  foundUser.password = hash;
  await foundUser.save();

  return res.status(200).json({
    success: true,
    message: "Password changed successfully through forgot password",
  });
};

const resetPassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Email, old password and new password are required",
    });
  }

  if (req.user.email !== email.toLowerCase()) {
    return res.status(403).json({
      success: false,
      message: "You can reset only your own password",
    });
  }

  const foundUser = await User.findOne({ email: email.toLowerCase() });

  if (!foundUser) {
    return res.status(404).json({
      success: false,
      message: "User not found with this email",
    });
  }

  const match = await bcrypt.compare(oldPassword, foundUser.password);

  if (!match) {
    return res.status(401).json({
      success: false,
      message: "Old password is incorrect",
    });
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(newPassword, salt);

  foundUser.password = hash;
  await foundUser.save();

  return res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
};

module.exports = {
  signup,
  loginUser,
  getProfile,
  forgotPassword,
  resetPassword,
};

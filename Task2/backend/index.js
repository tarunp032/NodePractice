const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 8080;
const mongoURL = "mongodb://127.0.0.1:27017/task2";

app.use(cors());
app.use(express.json());

mongoose
  .connect(mongoURL)
  .then(() => console.log("Database is connected"))
  .catch((err) => console.log("Database is not connected", err));

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String },
    dob: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    pincode: { type: Number },
    address: { type: String },
    occupation: { type: String },
    company: { type: String },
    salary: { type: Number },
    website: { type: String },
    linkedIn: { type: String },
    skills: { type: String },
    bio: { type: String },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// CREATE USER
app.post("/api/users", async (req, res) => {
  const newUser = new User(req.body);

  if (
    !newUser.firstName ||
    !newUser.email ||
    !newUser.password ||
    !newUser.phone ||
    !newUser.age
  ) {
    return res.status(400).json({
      message: "firstName, email, password, phone and age are required",
    });
  }

  await newUser.save();

  res.status(201).json({
    message: "User added successfully",
    user: newUser,
  });
});

// GET ALL USERS
app.get("/api/users", async (req, res) => {
  const allUsers = await User.find().sort({ createdAt: -1 });
  res.status(200).json(allUsers);
});

// GET ONE USER
app.get("/api/users/:id", async (req, res) => {
  const singleUser = await User.findById(req.params.id);

  if (!singleUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(singleUser);
});

// UPDATE USER
app.put("/api/users/:id", async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    message: "User updated successfully",
    user: updatedUser,
  });
});

// DELETE 
app.put("/api/users/delete/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status: "inactive" },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    message: "User status changed to inactive",
    user,
  });
});

// RESTORE 
app.put("/api/users/restore/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status: "active" },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    message: "User restored successfully",
    user,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
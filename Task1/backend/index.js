const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 8080;
const mongoURL = "mongodb://127.0.0.1:27017/task1";

app.use(express.json());
app.use(cors());

mongoose
  .connect(mongoURL)
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.log("Database is not connected", err);
  });

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      min: 18,
      max: 32,
    },

    phone: {
      type: String,
      trim: true,
    },

    username: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.post("/api/users", async (req, res) => {
  try {
    const { name, email, password, age, phone, username } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const oldUser = await User.findOne({ email: email });

    if (oldUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const newUser = new User({
      name,
      email,
      password,
      age,
      phone,
      username,
    });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({
      message: "Error while creating user",
      error: error.message,
    });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const allUsers = await User.find().sort({ createdAt: -1 });
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching users",
      error: error.message,
    });
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const oneUser = await User.findById(id);

    if (!oneUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(oneUser);
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching user",
      error: error.message,
    });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
      deletedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while deleting user",
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();
const port = 8080;
const mongoURL = "mongodb://127.0.0.1:27017/task3";

app.use(cors());
app.use(express.json());

mongoose
  .connect(mongoURL)
  .then(() => console.log("Database is connected"))
  .catch((err) => console.log("Database is not connected", err));

const productSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    rating: {
      rate: { type: Number, required: true },
      count: { type: Number, required: true },
    },
    status: { type: String, default: "active" },
    isSavedToDb: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// 1. CREATE PRODUCT
app.post("/api/products", async (req, res) => {
  try {
    const {
      id,
      title,
      price,
      description,
      category,
      image,
      rating,
      isSavedToDb,
    } = req.body;

    if (
      id === undefined ||
      !title ||
      price === undefined ||
      !description ||
      !category ||
      !image ||
      !rating ||
      rating.rate === undefined ||
      rating.count === undefined
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = await Product.create({
      id,
      title,
      price,
      description,
      category,
      image,
      rating,
      status: "active",
      isSavedToDb: isSavedToDb ? true : false,
    });

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// 2. GET ALL PRODUCTS
app.get("/api/products", async (req, res) => {
  try {
    const { saved } = req.query;

    let query = {};

    if (saved === "true") {
      query.isSavedToDb = true;
    }

    const allProducts = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json(allProducts);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// 3. GET ONE PRODUCT
app.get("/api/products/:id", async (req, res) => {
  try {
    const singleProduct = await Product.findById(req.params.id);

    if (!singleProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(singleProduct);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// 4. UPDATE PRODUCT
app.put("/api/products/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// 5. SOFT DELETE
app.put("/api/products/delete/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: "inactive" },
      { new: true },
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product moved to inactive",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// 6. RESTORE PRODUCT
app.put("/api/products/restore/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: "active" },
      { new: true },
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product restored successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// 7. PERMANENT DELETE
app.delete("/api/products/permanent/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted permanently",
      product: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

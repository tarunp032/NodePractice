const Product = require("../Models/productModel");

// 1. CREATE PRODUCT
const createProduct = async (req, res) => {
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
};

// 2. GET ALL PRODUCTS
const allProducts = async (req, res) => {
  try {
    const { saved, search } = req.query;

    let query = {};

    if (saved === "true") {
      query.isSavedToDb = true;
    }

    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const allProducts = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json(allProducts);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// 3. GET ONE PRODUCT
const oneProduct = async (req, res) => {
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
};

// 4. UPDATE PRODUCT
const updateProduct = async (req, res) => {
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
};

// 5. SOFT DELETE
const softDelete = async (req, res) => {
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
};

// 6. RESTORE PRODUCT
const restoreProduct = async (req, res) => {
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
};

// 7. PERMANENT DELETE
const deletePermanent = async (req, res) => {
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
};

module.exports = {
  createProduct,
  allProducts,
  oneProduct,
  updateProduct,
  softDelete,
  restoreProduct,
  deletePermanent,
};

const Cart = require("../Models/cartModel");

// 1. Add to cart / increase quantity
const addToCart = async (req, res) => {
  try {
    const { productId, title, price, image } = req.body;

    const existing = await Cart.findOne({ productId });

    if (existing) {
      existing.quantity += 1;
      await existing.save();
      return res.status(200).json(existing);
    }

    const cartItem = new Cart({
      productId,
      title,
      price,
      image,
      quantity: 1,
    });

    await cartItem.save();
    res.status(201).json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Get all cart items
const getCartItems = async (req, res) => {
  try {
    const items = await Cart.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Increase quantity
const increaseCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const item = await Cart.findOne({ productId });

    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    item.quantity += 1;
    await item.save();

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Decrease quantity
const decreaseCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const item = await Cart.findOne({ productId });

    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    item.quantity -= 1;

    if (item.quantity <= 0) {
      await Cart.deleteOne({ productId });
      return res.status(200).json({ message: "Item removed from cart" });
    }

    await item.save();
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Remove item completely
const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const deletedItem = await Cart.findOneAndDelete({ productId });

    if (!deletedItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({ message: "Item removed completely" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. Get cart summary
const getCartSummary = async (req, res) => {
  try {
    const items = await Cart.find();

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    res.status(200).json({
      totalItems,
      totalAmount,
      items,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addToCart,
  getCartItems,
  increaseCartItem,
  decreaseCartItem,
  removeCartItem,
  getCartSummary,
};

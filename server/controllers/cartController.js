const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Notification = require("../models/Notification");

// =========================
// ADD TO CART
// =========================
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const price =
      product.discount > 0
        ? product.discountedPrice
        : product.price;

    const existing = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.items.push({
        product: productId,
        quantity: 1,
        price, // ✅ important for total
      });
    }

    await cart.save();

    const populated = await cart.populate("items.product");

    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding to cart" });
  }
};

// =========================
// GET CART
// =========================
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId })
      .populate("items.product");

    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart" });
  }
};

// =========================
// UPDATE QUANTITY (FIXED)
// =========================
exports.updateCart = async (req, res) => {
  try {
    const { userId, productId, type } = req.body;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (i) => i.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (type === "inc") {
      item.quantity += 1;
    } else if (type === "dec") {
      item.quantity -= 1;

      if (item.quantity <= 0) {
        cart.items = cart.items.filter(
          (i) => i.product.toString() !== productId
        );
      }
    }

    await cart.save();

    const updated = await Cart.findOne({ user: userId })
      .populate("items.product");

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

// =========================
// REMOVE ITEM (FIXED)
// =========================
exports.removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (i) => i.product.toString() !== productId
    );

    await cart.save();

    const updated = await Cart.findOne({ user: userId })
      .populate("items.product");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Remove failed" });
  }
};

// =========================
// STOCK REQUEST (UNCHANGED)
// =========================
exports.requestStock = async (req, res) => {
  try {
    const { productId, userId } = req.body;

    const product = await Product.findById(productId).populate("business");

    await Notification.create({
      user: product.business.owner,
      message: `Stock requested for ${product.name}`,
      type: "stock",
    });

    const io = req.app.get("io");
    io.to(product.business.owner.toString()).emit("newNotification", {
      message: `Stock requested for ${product.name}`,
    });

    res.json({ message: "Stock request sent" });
  } catch (err) {
    res.status(500).json({ message: "Stock request failed" });
  }
};
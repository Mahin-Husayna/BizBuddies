const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Notification = require("../models/Notification");

// ADD TO CART
exports.addToCart = async (req, res) => {
  const { userId, productId } = req.body;

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  const existing = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.items.push({ product: productId, quantity: 1 });
  }

  await cart.save();
  res.json(cart);
};

// GET CART
exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.params.userId }).populate("items.product");
  res.json(cart || { items: [] });
};

// UPDATE QUANTITY
exports.updateQuantity = async (req, res) => {
  const { cartId, productId, quantity } = req.body;

  const cart = await Cart.findById(cartId);

  const item = cart.items.find(
    (i) => i.product.toString() === productId
  );

  if (item) item.quantity = quantity;

  await cart.save();
  res.json(cart);
};

// REMOVE ITEM
exports.removeItem = async (req, res) => {
  const { cartId, productId } = req.body;

  const cart = await Cart.findById(cartId);

  cart.items = cart.items.filter(
    (i) => i.product.toString() !== productId
  );

  await cart.save();
  res.json(cart);
};

// STOCK REQUEST
exports.requestStock = async (req, res) => {
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
};
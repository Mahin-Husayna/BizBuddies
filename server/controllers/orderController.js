const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Notification = require("../models/Notification");

// =========================
// CREATE ORDER (CHECKOUT)
// =========================
exports.createOrder = async (req, res) => {
  try {
    const { userId } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;

    const items = cart.items.map((item) => {
      const price =
        item.product.discount > 0
          ? item.product.discountedPrice
          : item.product.price;

      total += price * item.quantity;

      return {
        product: item.product._id,
        quantity: item.quantity,
        price,
      };
    });

    const order = new Order({
      user: userId,
      items,
      totalAmount: total,
    });

    await order.save();

    // 🔔 Notify sellers
    for (let item of cart.items) {
      await Notification.create({
        user: item.product.business, // seller side (adjust if needed)
        message: "New order received",
        type: "order",
      });
    }

    // 🧹 CLEAR CART
    cart.items = [];
    await cart.save();

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order failed" });
  }
};

// =========================
// GET USER ORDERS
// =========================
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate({
        path: "items.product",
        populate: {
          path: "business",
          select: "name coverImage",
        },
      })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};
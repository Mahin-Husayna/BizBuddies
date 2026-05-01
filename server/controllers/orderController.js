const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Notification = require("../models/Notification");

// =========================
// CREATE ORDER / CHECKOUT
// =========================
exports.createOrder = async (req, res) => {
  try {
    const {
      userId,
      deliveryAddress,
      paymentMethod,
      coordinates,
    } = req.body;

    // 🔒 VALIDATION
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!deliveryAddress || !deliveryAddress.trim()) {
      return res
        .status(400)
        .json({ message: "Delivery address is required" });
    }

    // =========================
    // FETCH CART
    // =========================
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      populate: {
        path: "business",
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // =========================
    // CALCULATE TOTAL
    // =========================
    let totalAmount = 0;

    const items = cart.items.map((item) => {
      const product = item.product;

      const price =
        product.discount > 0
          ? product.discountedPrice
          : product.price;

      totalAmount += price * item.quantity;

      return {
        product: product._id,
        quantity: item.quantity,
        price,
      };
    });

    // =========================
    // GET BUSINESS
    // =========================
    const business = cart.items[0].product.business;

    if (!business || !business._id) {
      return res.status(400).json({ message: "Business not found" });
    }

    // =========================
    // CREATE ORDER
    // =========================
    const order = new Order({
      user: userId,
      business: business._id,
      items,
      totalAmount,
      deliveryAddress,

      // ✅ NEW FEATURES (SAFE ADD)
      paymentMethod: paymentMethod || "cod",
      coordinates: coordinates || null,

      status: "pending",
    });

    await order.save();

    // =========================
    // REDUCE STOCK
    // =========================
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // =========================
    // NOTIFY SELLER
    // =========================
    const notification = await Notification.create({
      user: business.owner,
      message: "New order received",
      type: "order",
    });

    const io = req.app.get("io");

    io.to(business.owner.toString()).emit("newNotification", {
      _id: notification._id,
      message: notification.message,
      isRead: false,
      type: "order",
    });

    // =========================
    // CLEAR CART
    // =========================
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
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
    console.error("GET USER ORDERS ERROR:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// =========================
// GET SELLER ORDERS
// =========================
exports.getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      business: req.params.businessId,
    })
      .populate("items.product")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("GET SELLER ORDERS ERROR:", err);
    res.status(500).json({ message: "Error fetching seller orders" });
  }
};

// =========================
// UPDATE ORDER STATUS
// =========================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );

    res.json(order);
  } catch (err) {
    console.error("UPDATE ORDER STATUS ERROR:", err);
    res.status(500).json({ message: "Error updating status" });
  }
};
const Review = require("../models/Review");
const Business = require("../models/Business");
const Order = require("../models/Order");

// =========================
// ADD REVIEW (ONLY AFTER DELIVERY)
// =========================
exports.addReview = async (req, res) => {
  try {
    const { userId, orderId, rating, comment } = req.body;

    // 🔒 CHECK ORDER
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔒 ONLY IF DELIVERED
    if (order.status !== "delivered") {
      return res.status(400).json({ message: "Order not delivered yet" });
    }

    // 🔒 ONLY OWNER CAN REVIEW
    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 🔒 PREVENT MULTIPLE REVIEWS
    const existing = await Review.findOne({ order: orderId });

    if (existing) {
      return res.status(400).json({ message: "Already reviewed" });
    }

    // =========================
    // CREATE REVIEW
    // =========================
    const review = new Review({
      user: userId,
      business: order.business,
      order: orderId,
      rating,
      comment,
    });

    await review.save();

    // =========================
    // UPDATE BUSINESS RATING
    // =========================
    const reviews = await Review.find({
      business: order.business,
    });

    const avg =
      reviews.reduce((acc, r) => acc + r.rating, 0) /
      reviews.length;

    await Business.findByIdAndUpdate(order.business, {
      averageRating: avg,
      totalReviews: reviews.length,
    });

    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding review" });
  }
};

// =========================
// GET BUSINESS REVIEWS
// =========================
exports.getBusinessReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      business: req.params.businessId,
    }).populate("user", "name");

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
};
const Review = require("../models/Review");
const Business = require("../models/Business");
const Order = require("../models/Order");


exports.addReview = async (req, res) => {
  try {
    const { userId, orderId, rating, comment } = req.body;

    // check order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // shudhu delivery complete hole
    if (order.status !== "delivered") {
      return res.status(400).json({ message: "Order not delivered yet" });
    }

    // only owner
    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    //ektar beshi review daya jabena
    const existing = await Review.findOne({ order: orderId });

    if (existing) {
      return res.status(400).json({ message: "Already reviewed" });
    }

   //create review
    const review = new Review({
      user: userId,
      business: order.business,
      order: orderId,
      rating,
      comment,
    });

    await review.save();

    //update rating
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


//get reviews
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
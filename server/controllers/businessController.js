const Business = require("../models/Business");
const Product = require("../models/Product");
const User = require("../models/User");
const Notification = require("../models/Notification");
const Review = require("../models/Review"); // ⭐ NEW

// =========================
// CREATE BUSINESS
// =========================
exports.createBusiness = async (req, res) => {
  try {
    const { name, description, category, owner, ownerName } = req.body;

    if (!owner || owner === "undefined") {
      return res.status(400).json({ message: "Owner ID missing" });
    }

    const coverImage = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : "";

    const business = new Business({
      name,
      description,
      category,
      owner,
      ownerName: ownerName || "Unknown",
      coverImage,
      status: "pending",
    });

    await business.save();

    res.status(201).json({
      message: "Business sent for admin approval",
      business,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating business",
    });
  }
};

// =========================
// ⭐ HELPER: ADD RATING DATA
// =========================
const attachRatings = async (businesses) => {
  return Promise.all(
    businesses.map(async (b) => {
      const reviews = await Review.find({ business: b._id });

      const total = reviews.reduce((acc, r) => acc + r.rating, 0);

      const avgRating =
        reviews.length > 0 ? total / reviews.length : 0;

      return {
        ...b._doc,
        avgRating: Number(avgRating.toFixed(1)),
        totalReviews: reviews.length,
      };
    })
  );
};

// =========================
// PUBLIC: ONLY APPROVED
// =========================
exports.getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({
      status: "approved",
    }).sort({ createdAt: -1 });

    const enriched = await attachRatings(businesses); // ⭐ NEW

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: "Error fetching businesses" });
  }
};

// =========================
// USER: GET OWN BUSINESS
// =========================
exports.getBusinessByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || userId === "undefined") {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const business = await Business.findOne({
      owner: userId,
    });

    if (!business) return res.json(null);

    const enriched = await attachRatings([business]);

    res.json(enriched[0]); // ⭐ NEW
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching business" });
  }
};

// =========================
// GET SINGLE BUSINESS
// =========================
exports.getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const enriched = await attachRatings([business]); // ⭐ NEW

    res.json(enriched[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching business" });
  }
};

// =========================
// ADMIN: GET ALL
// =========================
exports.getAllBusinessesAdmin = async (req, res) => {
  try {
    const businesses = await Business.find().sort({
      createdAt: -1,
    });

    const enriched = await attachRatings(businesses); // ⭐ NEW

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: "Error fetching admin businesses" });
  }
};

// =========================
// ADMIN: STATS
// =========================
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBusinesses = await Business.countDocuments();
    const pendingBusinesses = await Business.countDocuments({
      status: "pending",
    });
    const approvedBusinesses = await Business.countDocuments({
      status: "approved",
    });
    const bannedBusinesses = await Business.countDocuments({
      status: "banned",
    });

    res.json({
      totalUsers,
      totalBusinesses,
      pendingBusinesses,
      approvedBusinesses,
      bannedBusinesses,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching admin stats" });
  }
};

// =========================
// 🔔 REALTIME HELPER
// =========================
const sendRealtimeNotification = (req, userId, message) => {
  const io = req.app.get("io");
  const users = req.app.get("users");

  const socketId = users[userId];

  if (socketId) {
    io.to(socketId).emit("newNotification", {
      message,
    });
  }
};

// =========================
// ADMIN: APPROVE
// =========================
exports.approveBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    const message = `🎉 Your business "${business.name}" has been approved!`;

    await Notification.create({
      user: business.owner,
      message,
      type: "business",
    });

    sendRealtimeNotification(req, business.owner.toString(), message);

    res.json(business);
  } catch (err) {
    res.status(500).json({ message: "Error approving business" });
  }
};

// =========================
// ADMIN: REJECT
// =========================
exports.rejectBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    const message = `❌ Your business "${business.name}" was rejected.`;

    await Notification.create({
      user: business.owner,
      message,
      type: "business",
    });

    sendRealtimeNotification(req, business.owner.toString(), message);

    res.json(business);
  } catch (err) {
    res.status(500).json({ message: "Error rejecting business" });
  }
};

// =========================
// ADMIN: BAN
// =========================
exports.banBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { status: "banned" },
      { new: true }
    );

    const message = `🚫 Your business "${business.name}" has been banned.`;

    await Notification.create({
      user: business.owner,
      message,
      type: "business",
    });

    sendRealtimeNotification(req, business.owner.toString(), message);

    res.json(business);
  } catch (err) {
    res.status(500).json({ message: "Error banning business" });
  }
};

// =========================
// DELETE BUSINESS
// =========================
exports.deleteBusiness = async (req, res) => {
  try {
    const { id } = req.params;

    await Product.deleteMany({ business: id });
    await Business.findByIdAndDelete(id);

    res.json({ message: "Business deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting business" });
  }
};

// =========================
// 🏆 LEADERBOARD (UPDATED)
// =========================
exports.getLeaderboard = async (req, res) => {
  try {
    const businesses = await Business.find({
      status: "approved",
    });

    const enriched = await attachRatings(businesses);

    const sorted = enriched
      .sort(
        (a, b) =>
          b.avgRating - a.avgRating ||
          b.totalReviews - a.totalReviews
      )
      .slice(0, 5);

    res.json(sorted);
  } catch (err) {
    console.error("LEADERBOARD ERROR:", err);
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
};
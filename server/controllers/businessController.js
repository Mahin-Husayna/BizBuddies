const Business = require("../models/Business");
const Product = require("../models/Product");
const User = require("../models/User");

// ================= CREATE BUSINESS =================
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
    res.status(500).json({ message: "Error creating business" });
  }
};

// ================= PUBLIC =================
exports.getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({ status: "approved" }).sort({
      createdAt: -1,
    });

    res.json(businesses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching businesses" });
  }
};

// ================= USER =================
exports.getBusinessByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || userId === "undefined") {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const business = await Business.findOne({ owner: userId });

    res.json(business);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching business" });
  }
};

// ================= SINGLE =================
exports.getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.json(business);
  } catch (error) {
    res.status(500).json({ message: "Error fetching business" });
  }
};

// ================= DELETE =================
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

// ================= ADMIN =================

// GET ALL BUSINESSES (ADMIN)
exports.getAllBusinessesAdmin = async (req, res) => {
  try {
    const businesses = await Business.find().sort({ createdAt: -1 });
    res.json(businesses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching admin businesses" });
  }
};

// ADMIN STATS
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

// APPROVE
exports.approveBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    res.json(business);
  } catch (err) {
    res.status(500).json({ message: "Error approving business" });
  }
};

// REJECT
exports.rejectBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    res.json(business);
  } catch (err) {
    res.status(500).json({ message: "Error rejecting business" });
  }
};

// BAN
exports.banBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { status: "banned" },
      { new: true }
    );

    res.json(business);
  } catch (err) {
    res.status(500).json({ message: "Error banning business" });
  }
};
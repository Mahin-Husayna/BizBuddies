const Business = require("../models/Business");
const Product = require("../models/Product");
const User = require("../models/User");

// CREATE BUSINESS
exports.createBusiness = async (req, res) => {
  try {
    const { name, description, category, owner, ownerName } = req.body;

    // 🔥 VALIDATION
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

// PUBLIC: ONLY APPROVED BUSINESSES
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

// USER: GET OWN BUSINESS
exports.getBusinessByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // 🔥 CRASH FIX
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

// GET SINGLE BUSINESS
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

// DELETE BUSINESS
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
const Business = require("../models/Business");
const Product = require("../models/Product");

// ✅ CREATE BUSINESS
exports.createBusiness = async (req, res) => {
  try {
    const { name, description, category, owner, ownerName } = req.body;

    const coverImage = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : "";

    const business = new Business({
      name,
      description,
      category,
      owner,
      ownerName: ownerName || "Unknown", // ✅ SAFE
      coverImage,
    });

    await business.save();

    res.status(201).json(business);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating business",
      error,
    });
  }
};

// ✅ GET ALL BUSINESSES (FOR HOMEPAGE)
exports.getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find().sort({ createdAt: -1 });
    res.json(businesses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching businesses" });
  }
};

// ✅ GET BUSINESS BY USER
exports.getBusinessByUser = async (req, res) => {
  try {
    const business = await Business.findOne({
      owner: req.params.userId,
    });

    res.json(business);
  } catch (error) {
    res.status(500).json({ message: "Error fetching business" });
  }
};

// ✅ GET BUSINESS BY ID
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

// ✅ DELETE BUSINESS
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
const Business = require("../models/Business");
const Product = require("../models/Product"); // 👈 needed for cascade delete


// CREATE BUSINESS
exports.createBusiness = async (req, res) => {
  try {
    const { name, description, category, owner, ownerName } = req.body;

    const business = new Business({
      name,
      description,
      category,
      owner,
      ownerName,
    });

    await business.save();
    res.status(201).json(business);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating business" });
  }
};


// GET MY BUSINESS
exports.getMyBusiness = async (req, res) => {
  try {
    const { userId } = req.params;

    const business = await Business.findOne({ owner: userId });

    res.json(business);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching business" });
  }
};


// GET ALL BUSINESSES
exports.getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find().sort({ createdAt: -1 });

    res.json(businesses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching businesses" });
  }
};


// DELETE BUSINESS + DELETE RELATED PRODUCTS
exports.deleteBusiness = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the business
    await Business.findByIdAndDelete(id);

    // 🔥 Delete all products under this business
    await Product.deleteMany({ business: id });

    res.json({ message: "Business and its products deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting business" });
  }
};
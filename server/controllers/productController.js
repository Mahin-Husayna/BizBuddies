const Product = require("../models/Product");

// CREATE PRODUCT (WITH IMAGE UPLOAD)
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      business,
      seller,
      description,
      type,
    } = req.body;

    const image = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : "";

    const product = new Product({
      name,
      price,
      image,
      seller,
      business,
      description,
      type,
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating product",
      error,
    });
  }
};

// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("business")
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error,
    });
  }
};

// GET PRODUCTS BY BUSINESS
exports.getProductsByBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;

    const products = await Product.find({
      business: businessId,
    }).sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching business products",
      error,
    });
  }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await Product.findByIdAndDelete(id);

    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error deleting product",
    });
  }
};
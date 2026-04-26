const Product = require("../models/Product");

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, image, seller, business, description, type } = req.body;

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
    res.status(500).json({
      message: "Error creating product",
      error,
    });
  }
};

// Get all products
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

// Get products by business
exports.getProductsByBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;

    const products = await Product.find({ business: businessId }).sort({
      createdAt: -1,
    });

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
    res.status(500).json({ message: "Error deleting product" });
  }
};
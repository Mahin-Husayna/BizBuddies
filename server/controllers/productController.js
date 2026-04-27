const Product = require("../models/Product");

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      business,
      seller,
      description,
      type,
      discount,
      offerEndsAt,
    } = req.body;

    const numericPrice = Number(price);
    const numericDiscount = Number(discount) || 0;

    let discountedPrice = numericPrice;

    if (numericDiscount > 0) {
      discountedPrice = numericPrice - (numericPrice * numericDiscount) / 100;
    }

    const image = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : "";

    const product = new Product({
      name,
      price: numericPrice,
      discount: numericDiscount,
      discountedPrice,
      offerEndsAt: offerEndsAt || null,
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

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      type,
      discount,
      offerEndsAt,
    } = req.body;

    const numericPrice = Number(price);
    const numericDiscount = Number(discount) || 0;

    let discountedPrice = numericPrice;

    if (numericDiscount > 0) {
      discountedPrice = numericPrice - (numericPrice * numericDiscount) / 100;
    }

    const updateData = {
      name,
      price: numericPrice,
      discount: numericDiscount,
      discountedPrice,
      offerEndsAt: offerEndsAt || null,
      description,
      type,
    };

    if (req.file) {
      updateData.image = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating product" });
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
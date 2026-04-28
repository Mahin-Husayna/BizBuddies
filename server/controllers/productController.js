const Product = require("../models/Product");

// =========================
// CREATE PRODUCT
// =========================
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
      stock,
    } = req.body;

    // 🔥 CRITICAL FIX
    if (!business || business === "undefined") {
      return res.status(400).json({
        message: "Business ID is required",
      });
    }

    const image = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : "";

    const numericPrice = Number(price);
    const numericDiscount = Number(discount) || 0;
    const numericStock = Number(stock) || 0;

    let discountedPrice = numericPrice;

    if (numericDiscount > 0) {
      discountedPrice =
        numericPrice - (numericPrice * numericDiscount) / 100;
    }

    const product = new Product({
      name,
      price: numericPrice,
      stock: numericStock,
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
    console.error("CREATE PRODUCT ERROR:", error);
    res.status(500).json({
      message: "Error creating product",
    });
  }
};

// =========================
// GET ALL PRODUCTS
// =========================
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("business")
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching products",
    });
  }
};

// =========================
// GET PRODUCTS BY BUSINESS
// =========================
exports.getProductsByBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;

    // 🔥 SAFETY
    if (!businessId || businessId === "undefined") {
      return res.status(400).json({
        message: "Invalid businessId",
      });
    }

    const products = await Product.find({
      business: businessId,
    }).sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching business products",
    });
  }
};

// =========================
// UPDATE PRODUCT
// =========================
exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      type,
      discount,
      offerEndsAt,
      stock,
    } = req.body;

    const numericPrice = Number(price);
    const numericDiscount = Number(discount) || 0;
    const numericStock = Number(stock) || 0;

    let discountedPrice = numericPrice;

    if (numericDiscount > 0) {
      discountedPrice =
        numericPrice - (numericPrice * numericDiscount) / 100;
    }

    const updateData = {
      name,
      price: numericPrice,
      stock: numericStock,
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

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating product",
    });
  }
};

// =========================
// DELETE PRODUCT
// =========================
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
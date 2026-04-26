const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Business = require("../models/Business");

// 🔍 SEARCH
router.get("/", async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.json({ products: [], businesses: [] });
    }

    // 🔎 search products
    const products = await Product.find({
      name: { $regex: query, $options: "i" },
    });

    // 🔎 search businesses (name OR category)
    const businesses = await Business.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    });

    res.json({ products, businesses });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search error" });
  }
});

module.exports = router;
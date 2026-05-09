const express = require("express");
const router = express.Router();

const {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  requestStock, // ✅ ADD THIS
} = require("../controllers/cartController");

// =========================
// GET CART
// =========================
router.get("/:userId", getCart);

// =========================
// ADD TO CART
// =========================
router.post("/add", addToCart);

// =========================
// UPDATE QUANTITY
// =========================
router.put("/update", updateCart);

// =========================
// REMOVE ITEM
// =========================
router.put("/remove", removeFromCart);

// =========================
// REQUEST STOCK
// =========================
router.post("/request-stock", requestStock);

module.exports = router;
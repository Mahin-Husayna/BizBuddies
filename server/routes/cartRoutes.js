const express = require("express");
const router = express.Router();

const {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
} = require("../controllers/cartController");

// GET CART
router.get("/:userId", getCart);

// ADD TO CART
router.post("/add", addToCart);

// ✅ UPDATE QUANTITY
router.put("/update", updateCart);

// ✅ REMOVE ITEM
router.put("/remove", removeFromCart);

module.exports = router;
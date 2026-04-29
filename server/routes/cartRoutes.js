const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  updateQuantity,
  removeItem,
  requestStock,
} = require("../controllers/cartController");

router.post("/add", addToCart);
router.get("/:userId", getCart);
router.put("/update", updateQuantity);
router.delete("/remove", removeItem);
router.post("/request-stock", requestStock);

module.exports = router;
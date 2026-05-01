const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
  getSellerOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

// USER
router.post("/create", createOrder);
router.get("/:userId", getOrders);

// SELLER
router.get("/seller/:businessId", getSellerOrders);
router.put("/status/:orderId", updateOrderStatus);

module.exports = router;
const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductsByBusiness,
  deleteProduct,
} = require("../controllers/productController");

// CREATE
router.post("/", createProduct);

// GET ALL
router.get("/", getProducts);

// GET BY BUSINESS
router.get("/business/:businessId", getProductsByBusiness);

// DELETE
router.delete("/:id", deleteProduct);

module.exports = router;
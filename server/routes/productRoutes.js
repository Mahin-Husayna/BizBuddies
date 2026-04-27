const express = require("express");
const router = express.Router();

const upload = require("../config/upload");

const {
  createProduct,
  getProducts,
  getProductsByBusiness,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// CREATE PRODUCT WITH IMAGE
router.post("/", upload.single("image"), createProduct);

// GET ALL PRODUCTS
router.get("/", getProducts);

// GET PRODUCTS BY BUSINESS
router.get("/business/:businessId", getProductsByBusiness);

// UPDATE PRODUCT WITH OPTIONAL IMAGE
router.put("/:id", upload.single("image"), updateProduct);

// DELETE PRODUCT
router.delete("/:id", deleteProduct);

module.exports = router;
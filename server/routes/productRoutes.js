const express = require("express");
const router = express.Router();

const upload = require("../config/upload");
const {
  createProduct,
  getProducts,
  getProductsByBusiness,
  deleteProduct,
} = require("../controllers/productController");

// ✅ MUST HAVE THIS
router.post("/", upload.single("image"), createProduct);

router.get("/", getProducts);
router.get("/business/:businessId", getProductsByBusiness);
router.delete("/:id", deleteProduct);

module.exports = router;
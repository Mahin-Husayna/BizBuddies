const express = require("express");
const router = express.Router();

const {
  addReview,
  getBusinessReviews,
} = require("../controllers/reviewController");

router.post("/", addReview);
router.get("/:businessId", getBusinessReviews);

module.exports = router;
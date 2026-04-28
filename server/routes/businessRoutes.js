const express = require("express");
const router = express.Router();

const upload = require("../config/upload");

const {
  createBusiness,
  getAllBusinesses,
  getBusinessByUser,
  getBusinessById,
  deleteBusiness,
} = require("../controllers/businessController");

// CREATE BUSINESS (with image)
router.post("/", upload.single("coverImage"), createBusiness);

// GET ALL (homepage)
router.get("/", getAllBusinesses);

// GET USER BUSINESS
router.get("/:userId", getBusinessByUser);

// GET SINGLE BUSINESS
router.get("/single/:id", getBusinessById);

// DELETE
router.delete("/:id", deleteBusiness);

module.exports = router;
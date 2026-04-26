const express = require("express");
const router = express.Router();

const Business = require("../models/Business");

const {
  createBusiness,
  getMyBusiness,
  getAllBusinesses,
  deleteBusiness,
} = require("../controllers/businessController");

// CREATE
router.post("/", createBusiness);

// GET SINGLE BUSINESS
router.get("/single/:id", async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    res.json(business);
  } catch (err) {
    res.status(500).json({ message: "Error fetching business" });
  }
});

// GET ALL
router.get("/", getAllBusinesses);

// GET MY BUSINESS
router.get("/:userId", getMyBusiness);

// DELETE BUSINESS
router.delete("/:id", deleteBusiness);

module.exports = router;
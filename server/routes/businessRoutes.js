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

// CREATE
router.post("/", upload.single("coverImage"), createBusiness);

// GET ALL (homepage)
router.get("/", getAllBusinesses);

// GET ONE
router.get("/single/:id", getBusinessById);

// GET USER BUSINESS
router.get("/:userId", getBusinessByUser);

// DELETE
router.delete("/:id", deleteBusiness);

module.exports = router;
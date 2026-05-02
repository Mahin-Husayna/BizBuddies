const express = require("express");
const router = express.Router();

const {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
} = require("../controllers/announcementController");

// =========================
// CREATE ANNOUNCEMENT
// =========================
router.post("/", createAnnouncement);

// =========================
// GET ALL ANNOUNCEMENTS
// =========================
router.get("/", getAnnouncements);

// =========================
// DELETE ANNOUNCEMENT
// =========================
router.delete("/:id", deleteAnnouncement);

module.exports = router;
const express = require("express");
const router = express.Router();

const {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
} = require("../controllers/announcementController");


router.post("/", createAnnouncement);

router.get("/", getAnnouncements);

router.delete("/:id", deleteAnnouncement);

module.exports = router;
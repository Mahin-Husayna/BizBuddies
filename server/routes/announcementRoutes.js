const express = require("express");
const router = express.Router();
const Announcement = require("../models/Announcement");

router.get("/", async (req, res) => {
  const data = await Announcement.find().sort({ createdAt: -1 });
  res.json(data);
});

router.post("/", async (req, res) => {
  const newA = new Announcement(req.body);
  await newA.save();
  res.json(newA);
});

module.exports = router;
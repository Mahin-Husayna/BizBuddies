const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  title: String,
  content: String,
});

module.exports = mongoose.model("Announcement", announcementSchema);
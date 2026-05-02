const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["offer", "event", "update", "alert"],
      default: "update",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    role: {
      type: String,
      enum: ["admin", "seller"],
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    business: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Business",
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
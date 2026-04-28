const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  ownerName: {
    type: String,
    default: "Unknown",
  },

  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    default: "",
  },

  category: {
    type: String,
    default: "",
  },

  coverImage: {
    type: String,
    default: "",
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "banned"],
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Business", businessSchema);
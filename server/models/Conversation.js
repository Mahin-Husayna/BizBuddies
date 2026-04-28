const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    // 🔥 LAST MESSAGE (for preview + sorting)
    lastMessage: {
      text: {
        type: String,
        default: "",
      },
      createdAt: {
        type: Date,
        default: null,
      },
    },

    // 🔴 UNREAD COUNT (REAL badge logic)
    unreadCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
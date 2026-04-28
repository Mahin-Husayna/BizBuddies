const express = require("express");
const router = express.Router();

const {
  startConversation,
  sendMessage,
  getConversations,
  getMessages,
  markAsRead,
} = require("../controllers/messageController");

// START CONVO
router.post("/start", startConversation);

// SEND MESSAGE
router.post("/send", sendMessage);

// GET CONVERSATIONS
router.get("/conversations/:userId", getConversations);

// GET MESSAGES
router.get("/:convoId", getMessages);

// MARK AS READ
router.put("/read/:convoId", markAsRead);

module.exports = router;
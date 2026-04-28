const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Notification = require("../models/Notification");

// =========================
// START CONVERSATION
// =========================
exports.startConversation = async (req, res) => {
  try {
    const { senderId, receiverId, productId } = req.body;

    let convo = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
      product: productId || null,
    });

    if (!convo) {
      convo = new Conversation({
        members: [senderId, receiverId],
        product: productId || null,
        unreadCount: 0,
      });
      await convo.save();
    }

    res.json(convo);
  } catch (err) {
    res.status(500).json({ message: "Error starting conversation" });
  }
};

// =========================
// SEND MESSAGE
// =========================
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, sender, text, receiverId } = req.body;

    const message = new Message({
      conversationId,
      sender,
      text,
    });

    await message.save();

    // 🔥 UPDATE CONVERSATION
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        text,
        createdAt: new Date(),
      },
      updatedAt: new Date(),
      $inc: { unreadCount: 1 }, // only matters for receiver UI
    });

    // 🔔 CREATE NOTIFICATION (IMPROVED)
    const notification = await Notification.create({
      user: receiverId,
      message: `New message: ${text}`,
      type: "message",
    });

    // 🔥 SOCKET
    const io = req.app.get("io");

    // 💬 real-time message
    io.to(receiverId).emit("newMessage", message);

    // 🔔 real-time notification
    io.to(receiverId).emit("newNotification", {
      _id: notification._id,
      message: notification.message,
      isRead: false,
    });

    res.json(message);
  } catch (err) {
    console.error("SEND MESSAGE ERROR:", err);
    res.status(500).json({ message: "Error sending message" });
  }
};

// =========================
// GET CONVERSATIONS
// =========================
exports.getConversations = async (req, res) => {
  try {
    const convos = await Conversation.find({
      members: { $in: [req.params.userId] },
    })
      .populate("members", "name")
      .populate({
        path: "product",
        populate: {
          path: "business",
          select: "name coverImage",
        },
      })
      .sort({ updatedAt: -1 });

    res.json(convos);
  } catch (err) {
    res.status(500).json({ message: "Error fetching conversations" });
  }
};

// =========================
// GET MESSAGES
// =========================
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.convoId,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
};

// =========================
// MARK AS READ
// =========================
exports.markAsRead = async (req, res) => {
  try {
    await Conversation.findByIdAndUpdate(req.params.convoId, {
      unreadCount: 0,
    });

    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Error updating read status" });
  }
};
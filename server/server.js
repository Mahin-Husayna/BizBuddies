require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const cartRoutes = require("./routes/cartRoutes");

// ================= MIDDLEWARE =================
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ================= MONGODB =================
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    // ✅ FIXED: removed deprecated options
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected ✅");
  } catch (error) {
    console.error("MongoDB error ❌:", error.message);
    process.exit(1);
  }
};

connectDB();

// ================= ROUTES =================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/business", require("./routes/businessRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/search", require("./routes/searchRoutes"));
app.use("/api/announcements", require("./routes/announcementRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/cart", cartRoutes);
app.use("/api/orders", require("./routes/orderRoutes"));

// ================= SOCKET.IO SETUP =================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// STORE CONNECTED USERS
const users = new Map();

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  // ✅ REGISTER USER
  socket.on("register", (userId) => {
    if (!userId) return;

    users.set(userId, socket.id);

    // 🔥 IMPORTANT: join room = userId
    socket.join(userId);

    console.log("Registered user:", userId);
  });

  // ❌ DISCONNECT
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);

    for (let [userId, sockId] of users.entries()) {
      if (sockId === socket.id) {
        users.delete(userId);
        break;
      }
    }
  });
});

// MAKE SOCKET AVAILABLE IN CONTROLLERS
app.set("io", io);
app.set("users", users);

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("BizBuddies API running...");
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("Server Error ❌:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;



server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
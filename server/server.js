const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ================= MONGODB =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("MongoDB error ❌:", err));

// ================= ROUTES =================
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const businessRoutes = require("./routes/businessRoutes");
app.use("/api/business", businessRoutes);

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const searchRoutes = require("./routes/searchRoutes");
app.use("/api/search", searchRoutes);

const announcementRoutes = require("./routes/announcementRoutes");
app.use("/api/announcements", announcementRoutes);

const notificationRoutes = require("./routes/notificationRoutes");
app.use("/api/notifications", notificationRoutes);

// ================= SOCKET.IO SETUP =================
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// STORE CONNECTED USERS
const users = {};

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.on("register", (userId) => {
    users[userId] = socket.id;
    console.log("Registered user:", userId);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);

    for (let id in users) {
      if (users[id] === socket.id) {
        delete users[id];
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

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
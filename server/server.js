const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("MongoDB error ❌:", err));

// Routes
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

app.use("/uploads", express.static("uploads"));



// Test route
app.get("/", (req, res) => {
  res.send("BizBuddies API running...");
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


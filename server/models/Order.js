const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },

    // ✅ DELIVERY TYPE (kept)
    deliveryType: {
      type: String,
      enum: ["campus", "custom"],
      default: "custom",
    },

    // ✅ ADDRESS (kept)
    deliveryAddress: {
      type: String,
      required: true,
    },

    // ✅ CAMPUS DELIVERY TIME (kept)
    deliveryTime: {
      type: String,
      default: "",
    },

    // 🔥 UPDATED STATUS FLOW (IMPORTANT)
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "out_for_delivery",
        "delivered",
      ],
      default: "pending",
    },

    // ✅ PAYMENT (kept)
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },

    // ✅ MAP COORDINATES (kept)
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
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

    // 🔥 NEW (safe addition)
    deliveryType: {
      type: String,
      enum: ["campus", "custom"],
      default: "custom",
    },

    deliveryAddress: {
      type: String,
      required: true,
    },

    // 🔥 NEW (only used for campus)
    deliveryTime: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "delivered"],
      default: "pending",
    },
    paymentMethod: {
  type: String,
  enum: ["cod", "online"],
  default: "cod",
},

coordinates: {
  lat: Number,
  lng: Number,
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
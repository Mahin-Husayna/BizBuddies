const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,

  // ✅ NEW STOCK FIELD
  stock: {
    type: Number,
    default: 0,
  },

  discount: {
    type: Number,
    default: 0,
  },

  discountedPrice: {
    type: Number,
    default: 0,
  },

  offerEndsAt: {
    type: Date,
    default: null,
  },

  image: String,
  seller: String,

  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
  },

  description: {
    type: String,
    default: "",
  },

  type: {
    type: String,
    default: "product",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
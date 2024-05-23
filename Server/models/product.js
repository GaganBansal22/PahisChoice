const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  url: "string",
  filename: "string"
})

const ProductSchema = new mongoose.Schema({
  name: "string",
  price: Number,
  mrp: Number,
  discount: Number,
  description: "string",
  images: [ImageSchema],
  category: "string",
  subCategory: "string",
  sub2Category: "string",
  size: "string",
  color: "string",
  qtyAvailable: Number,
  fixedDeliveryFee: Number,
  deliveryFeeIncrement: Number,
  weight: Number,
  length: Number,
  breadth: Number,
  height: Number,
})

module.exports = mongoose.model("Product", ProductSchema);
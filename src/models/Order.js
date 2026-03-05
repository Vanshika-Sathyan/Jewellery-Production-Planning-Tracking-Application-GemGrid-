const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    grams: {
      type: Number,
      required: true,
    },
    stones: {
      type: Number,
      required: true,
    },
    productType: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
    },
    shipDate: {
      type: Date,
      required: true,
    },
    currentStage: {
      type: String,
      required: true,
    },
    currentStageEntryTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["IN_PROGRESS", "COMPLETED"],
      default: "IN_PROGRESS",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
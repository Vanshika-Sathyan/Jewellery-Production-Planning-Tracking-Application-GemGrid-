const mongoose = require("mongoose");

const stageMovementSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    stageName: {
      type: String,
      required: true,
    },
    entryTime: {
      type: Date,
      required: true,
    },
    exitTime: {
      type: Date,
    },
    durationHours: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StageMovement", stageMovementSchema);
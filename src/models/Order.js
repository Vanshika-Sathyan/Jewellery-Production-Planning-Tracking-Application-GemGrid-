const mongoose = require("mongoose");

const StageHistorySchema = new mongoose.Schema({
  stageName: String,
  entryTime: Date,
  exitTime: Date,
  hoursSpent: Number
});

const OrderSchema = new mongoose.Schema({

  orderNumber: String,

  grams: Number,

  stones: Number,

  productType: String,

  priority: String,

  shipDate: Date,

  cell: String,

  currentStage: {
    type: String,
    default: "Order Created"
  },

  currentStageEntryTime: {
    type: Date,
    default: Date.now
  },

  stageHistory: [StageHistorySchema],

  isDelayed: {
    type: Boolean,
    default: false
  },

  status: {
    type: String,
    default: "IN_PROGRESS"
  }

}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
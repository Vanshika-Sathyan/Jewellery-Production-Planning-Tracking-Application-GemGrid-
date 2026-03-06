const mongoose = require("mongoose");

const StageMovementSchema = new mongoose.Schema({

  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
  },

  stageName: String,

  entryTime: Date,

  exitTime: Date,

  hoursSpent: Number

});

module.exports = mongoose.model("StageMovement", StageMovementSchema);